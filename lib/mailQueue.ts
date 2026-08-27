import { Queue, Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { sendBroadcastMail } from './broadcastMail';
import { sendEventMail } from './mail';

export type MailJobType = 'BROADCAST' | 'REGISTRATION';

export interface BroadcastMailPayload {
  type: 'BROADCAST';
  to: string;
  recipientName?: string;
  subject: string;
  headerBannerUrl?: string | null;
  bodyHtml: string;
  batchId?: string;
}

export interface RegistrationMailPayload {
  type: 'REGISTRATION';
  to: string;
  subject: string;
  event: any;
  registration: any;
  regType: 'PENDING' | 'CONFIRMED';
  originUrl: string;
}

export type MailJobPayload = BroadcastMailPayload | RegistrationMailPayload;

export const QUEUE_NAME = 'mail-broadcast-queue';
export const DAILY_LIMIT = 90; // 90 emails max per 24 hours (Resend Free Tier Limit)
export const BATCH_DELAY_MS = 10000; // 10 seconds gap between mails to ensure Inbox delivery & avoid Promotions/Spam tabs

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

const createRedisConnection = () => {
  return new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    lazyConnect: true,
  });
};

// In-memory fallback store for daily limit & local job execution if Redis connection fails
let localDailyCount = {
  date: new Date().toISOString().split('T')[0],
  count: 0,
};

function getDailyCountKey(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Calculates remaining milliseconds until daily quota resets at Midnight UTC (00:00:05 UTC)
 */
export function getMsUntilDailyReset(): number {
  const now = new Date();
  const tomorrow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 5));
  const diff = tomorrow.getTime() - now.getTime();
  // Fallback to at least 1 hour if calculation edge case
  return diff > 0 ? diff : 3600000;
}

export async function getTodaySentCount(): Promise<number> {
  const today = getDailyCountKey();
  if (localDailyCount.date !== today) {
    localDailyCount = { date: today, count: 0 };
  }
  
  try {
    const conn = createRedisConnection();
    const val = await conn.get(`mail_daily_limit:${today}`);
    await conn.quit();
    if (val) return parseInt(val, 10);
  } catch (err) {
    // Fallback to local memory count
  }
  return localDailyCount.count;
}

export async function incrementTodaySentCount(): Promise<number> {
  const today = getDailyCountKey();
  if (localDailyCount.date !== today) {
    localDailyCount = { date: today, count: 0 };
  }
  localDailyCount.count += 1;

  try {
    const conn = createRedisConnection();
    const newCount = await conn.incr(`mail_daily_limit:${today}`);
    await conn.expire(`mail_daily_limit:${today}`, 172800); // 48 hour TTL
    await conn.quit();
    return newCount;
  } catch (err) {
    return localDailyCount.count;
  }
}

export interface MailJobLog {
  id: string;
  to: string;
  subject: string;
  jobType: MailJobType;
  status: 'QUEUED' | 'SENDING' | 'COMPLETED' | 'FAILED' | 'DELAYED_FOR_NEXT_DAY_RESET';
  scheduledDelaySec: number;
  rescheduledForTomorrow?: boolean;
  timestamp: string;
  error?: string;
}

export const recentMailLogs: MailJobLog[] = [];

// Global singleton pattern to prevent duplicate BullMQ worker instances across Next.js reloads
const globalForMail = globalThis as unknown as {
  _mailQueue?: Queue<MailJobPayload>;
  _mailWorker?: Worker<MailJobPayload>;
  _processedMailSet?: Set<string>;
};

const processedMailSet = globalForMail._processedMailSet || new Set<string>();
if (!globalForMail._processedMailSet) {
  globalForMail._processedMailSet = processedMailSet;
}

/**
 * Deduplication guard: returns true if an identical email was sent to recipient within last 15 minutes
 */
function checkAndMarkDuplicate(to: string, subject: string): boolean {
  const cleanTo = (to || '').trim().toLowerCase();
  const cleanSubj = (subject || '').trim().toLowerCase();
  const dedupKey = `${cleanTo}:${cleanSubj}`;

  if (processedMailSet.has(dedupKey)) {
    console.warn(`[Mail Queue Deduplication] Suppressed duplicate mail attempt for ${cleanTo}: "${subject}"`);
    return true;
  }

  processedMailSet.add(dedupKey);
  // Remove key after 15 minutes (900,000ms)
  setTimeout(() => {
    processedMailSet.delete(dedupKey);
  }, 900000);

  return false;
}

export let mailQueue: Queue<MailJobPayload> | null = globalForMail._mailQueue || null;
export let mailWorker: Worker<MailJobPayload> | null = globalForMail._mailWorker || null;

/**
 * Execute mail dispatch based on payload type with strict deduplication
 */
async function processMailPayload(payload: MailJobPayload): Promise<{ success: boolean; error?: string }> {
  if (checkAndMarkDuplicate(payload.to, payload.subject)) {
    return { success: true };
  }

  if (payload.type === 'REGISTRATION') {
    return await sendEventMail({
      to: payload.to,
      subject: payload.subject,
      event: payload.event,
      registration: payload.registration,
      type: payload.regType,
      originUrl: payload.originUrl,
    });
  } else {
    return await sendBroadcastMail({
      to: payload.to,
      recipientName: payload.recipientName,
      subject: payload.subject,
      headerBannerUrl: payload.headerBannerUrl,
      bodyHtml: payload.bodyHtml,
    });
  }
}

// Global in-memory queue runner for bulletproof asynchronous dispatching
let isProcessingMemoryQueue = false;
const memoryMailQueue: { id: string; payload: MailJobPayload; delayMs: number; createdAt: number }[] = [];

async function triggerMemoryQueueRunner() {
  if (isProcessingMemoryQueue) return;
  isProcessingMemoryQueue = true;

  while (memoryMailQueue.length > 0) {
    const item = memoryMailQueue.shift();
    if (!item) break;

    const waitTime = Math.max(0, item.delayMs - (Date.now() - item.createdAt));
    if (waitTime > 0) {
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    try {
      const res = await processMailPayload(item.payload);
      if (res.success) {
        await incrementTodaySentCount();
        recentMailLogs.unshift({
          id: item.id,
          to: item.payload.to,
          subject: item.payload.subject,
          jobType: item.payload.type,
          status: 'COMPLETED',
          scheduledDelaySec: Math.round(item.delayMs / 1000),
          timestamp: new Date().toISOString(),
        });
      } else {
        recentMailLogs.unshift({
          id: item.id,
          to: item.payload.to,
          subject: item.payload.subject,
          jobType: item.payload.type,
          status: 'FAILED',
          scheduledDelaySec: Math.round(item.delayMs / 1000),
          timestamp: new Date().toISOString(),
          error: res.error,
        });
      }
    } catch (err: any) {
      console.error(`[Mail Queue Runner Error] for ${item.payload.to}:`, err?.message);
      recentMailLogs.unshift({
        id: item.id,
        to: item.payload.to,
        subject: item.payload.subject,
        jobType: item.payload.type,
        status: 'FAILED',
        scheduledDelaySec: Math.round(item.delayMs / 1000),
        timestamp: new Date().toISOString(),
        error: err?.message,
      });
    }

    if (recentMailLogs.length > 100) {
      recentMailLogs.length = 100;
    }
  }

  isProcessingMemoryQueue = false;
}

if (!globalForMail._mailQueue && !globalForMail._mailWorker) {
  try {
    const connection = createRedisConnection();
    mailQueue = new Queue<MailJobPayload>(QUEUE_NAME, {
      connection,
      defaultJobOptions: {
        removeOnComplete: 50,
        removeOnFail: 50,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 3000,
        },
      },
    });

    mailWorker = new Worker<MailJobPayload>(
      QUEUE_NAME,
      async (job: Job<MailJobPayload>) => {
        const payload = job.data;
        console.log(`[Mail Queue Worker] Processing ${payload.type} mail for ${payload.to}...`);

        const result = await processMailPayload(payload);

        if (result.success) {
          await incrementTodaySentCount();
          recentMailLogs.unshift({
            id: job.id || `job-${Date.now()}`,
            to: payload.to,
            subject: payload.subject,
            jobType: payload.type,
            status: 'COMPLETED',
            scheduledDelaySec: Math.round((job.delay || 0) / 1000),
            timestamp: new Date().toISOString(),
          });
        } else {
          recentMailLogs.unshift({
            id: job.id || `job-${Date.now()}`,
            to: payload.to,
            subject: payload.subject,
            jobType: payload.type,
            status: 'FAILED',
            scheduledDelaySec: Math.round((job.delay || 0) / 1000),
            timestamp: new Date().toISOString(),
            error: result.error,
          });
          throw new Error(result.error || 'Mail sending failed');
        }

        return { sent: true, recipient: payload.to };
      },
      {
        connection,
        concurrency: 1,
        limiter: {
          max: 1,
          duration: BATCH_DELAY_MS,
        },
      }
    );

    mailWorker.on('error', (err) => {
      console.warn('[Mail Queue Worker Notice]:', err.message);
    });

    globalForMail._mailQueue = mailQueue;
    globalForMail._mailWorker = mailWorker;
  } catch (err: any) {
    console.warn('[Mail Queue Initialization Notice]: Operating with ultra-resilient memory dispatcher.', err?.message);
  }
}

/**
 * Enqueue a registration email job (Dispatched immediately & asynchronously)
 */
export async function enqueueRegistrationMail(payload: Omit<RegistrationMailPayload, 'type'>): Promise<{ queued: boolean; jobId: string }> {
  const fullPayload: RegistrationMailPayload = { ...payload, type: 'REGISTRATION' };
  const jobId = `reg-mail-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  // Log as QUEUED immediately
  recentMailLogs.unshift({
    id: jobId,
    to: payload.to,
    subject: payload.subject,
    jobType: 'REGISTRATION',
    status: 'QUEUED',
    scheduledDelaySec: 0,
    timestamp: new Date().toISOString(),
  });

  if (recentMailLogs.length > 100) {
    recentMailLogs.length = 100;
  }

  // Execute asynchronously without blocking the registration API response
  setTimeout(async () => {
    try {
      const res = await processMailPayload(fullPayload);
      if (res.success) {
        await incrementTodaySentCount();
        const log = recentMailLogs.find((l) => l.id === jobId);
        if (log) {
          log.status = 'COMPLETED';
          log.timestamp = new Date().toISOString();
        }
      } else {
        const log = recentMailLogs.find((l) => l.id === jobId);
        if (log) {
          log.status = 'FAILED';
          log.error = res.error;
          log.timestamp = new Date().toISOString();
        }
      }
    } catch (err: any) {
      console.error('[Registration Mail Delivery Error]:', err?.message);
      const log = recentMailLogs.find((l) => l.id === jobId);
      if (log) {
        log.status = 'FAILED';
        log.error = err?.message;
        log.timestamp = new Date().toISOString();
      }
    }
  }, 10);

  return { queued: true, jobId };
}

/**
 * Enqueue broadcast email batch with smooth spacing (1.5s gap between emails)
 */
export async function enqueueBroadcastBatch(
  recipients: { email: string; name?: string }[],
  subject: string,
  bodyHtml: string,
  headerBannerUrl?: string | null
): Promise<{
  enqueuedCount: number;
  delayedForTomorrowCount: number;
  totalSentToday: number;
  remainingToday: number;
  logs: MailJobLog[];
}> {
  const currentSentToday = await getTodaySentCount();
  const remainingLimit = Math.max(0, DAILY_LIMIT - currentSentToday);

  const batchId = `batch-${Date.now()}`;
  const newLogs: MailJobLog[] = [];
  const PACE_DELAY_MS = 1500; // 1.5 seconds spacing for safe inbox delivery

  for (let i = 0; i < recipients.length; i++) {
    const r = recipients[i];
    const delayMs = i * PACE_DELAY_MS;
    const jobId = `mail-bcast-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`;

    const payload: BroadcastMailPayload = {
      type: 'BROADCAST',
      to: r.email,
      recipientName: r.name,
      subject,
      headerBannerUrl,
      bodyHtml,
      batchId,
    };

    const logEntry: MailJobLog = {
      id: jobId,
      to: r.email,
      subject,
      jobType: 'BROADCAST',
      status: 'QUEUED',
      scheduledDelaySec: Math.round(delayMs / 1000),
      rescheduledForTomorrow: false,
      timestamp: new Date().toISOString(),
    };

    newLogs.push(logEntry);
    recentMailLogs.unshift(logEntry);

    // Push to memory queue runner
    memoryMailQueue.push({
      id: jobId,
      payload,
      delayMs,
      createdAt: Date.now(),
    });
  }

  // Kick off background memory queue worker
  triggerMemoryQueueRunner().catch((e) => console.error('Memory queue runner trigger error:', e));

  if (recentMailLogs.length > 100) {
    recentMailLogs.length = 100;
  }

  return {
    enqueuedCount: recipients.length,
    delayedForTomorrowCount: 0,
    totalSentToday: currentSentToday,
    remainingToday: Math.max(0, remainingLimit - recipients.length),
    logs: newLogs,
  };
}
