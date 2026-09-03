import { sendBroadcastMail } from './broadcastMail';
import { sendEventMail } from './mail';
import Redis from 'ioredis';

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
export const DAILY_LIMIT = parseInt(process.env.MAIL_DAILY_LIMIT || '500', 10);
export const BATCH_DELAY_MS = 1000; // 1 second gap between broadcast emails for optimal deliverability

const redisUrl = process.env.REDIS_URL || process.env.KV_URL;

const createRedisConnection = () => {
  if (!redisUrl) return null;
  try {
    const client = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      connectTimeout: 2500,
      enableReadyCheck: false,
      lazyConnect: true,
      retryStrategy: () => null, // Don't keep retrying endlessly if redis is unavailable
    });
    client.on('error', (err) => {
      // Catch redis connection errors silently to allow memory fallback
    });
    return client;
  } catch {
    return null;
  }
};

// In-memory fallback store for daily limit
let localDailyCount = {
  date: new Date().toISOString().split('T')[0],
  count: 0,
};

function getDailyCountKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function getMsUntilDailyReset(): number {
  const now = new Date();
  const tomorrow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 5));
  const diff = tomorrow.getTime() - now.getTime();
  return diff > 0 ? diff : 3600000;
}

export async function getTodaySentCount(): Promise<number> {
  const today = getDailyCountKey();
  if (localDailyCount.date !== today) {
    localDailyCount = { date: today, count: 0 };
  }

  try {
    const conn = createRedisConnection();
    if (conn) {
      await conn.connect().catch(() => {});
      const val = await Promise.race([
        conn.get(`mail_daily_limit:${today}`).catch(() => null),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 1000))
      ]);
      await conn.quit().catch(() => {});
      if (val) return parseInt(val, 10);
    }
  } catch {
    // Graceful fallback to memory count
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
    if (conn) {
      await conn.connect().catch(() => {});
      const newCount = await Promise.race([
        (async () => {
          const res = await conn.incr(`mail_daily_limit:${today}`);
          await conn.expire(`mail_daily_limit:${today}`, 172800);
          return res;
        })().catch(() => localDailyCount.count),
        new Promise<number>((resolve) => setTimeout(() => resolve(localDailyCount.count), 1000))
      ]);
      await conn.quit().catch(() => {});
      return newCount;
    }
  } catch {
    // Memory count is already incremented
  }
  return localDailyCount.count;
}

export interface MailJobLog {
  id: string;
  to: string;
  subject: string;
  jobType: MailJobType;
  status: 'QUEUED' | 'SENDING' | 'COMPLETED' | 'FAILED';
  scheduledDelaySec: number;
  rescheduledForTomorrow?: boolean;
  timestamp: string;
  error?: string;
}

export const recentMailLogs: MailJobLog[] = [];

/**
 * Execute mail dispatch based on payload type
 */
async function processMailPayload(payload: MailJobPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
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

// Global in-memory queue runner for broadcast dispatching
let isProcessingMemoryQueue = false;
const memoryMailQueue: { id: string; payload: MailJobPayload; delayMs: number; createdAt: number }[] = [];

async function triggerMemoryQueueRunner() {
  if (isProcessingMemoryQueue) return;
  isProcessingMemoryQueue = true;

  try {
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
  } finally {
    isProcessingMemoryQueue = false;
  }
}

/**
 * Enqueue & dispatch a registration email job directly and reliably
 */
export async function enqueueRegistrationMail(payload: Omit<RegistrationMailPayload, 'type'>): Promise<{ queued: boolean; jobId: string; success: boolean; error?: string }> {
  const fullPayload: RegistrationMailPayload = { ...payload, type: 'REGISTRATION' };
  const jobId = `reg-mail-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  // Log as QUEUED immediately
  const logEntry: MailJobLog = {
    id: jobId,
    to: payload.to,
    subject: payload.subject,
    jobType: 'REGISTRATION',
    status: 'QUEUED',
    scheduledDelaySec: 0,
    timestamp: new Date().toISOString(),
  };
  recentMailLogs.unshift(logEntry);

  if (recentMailLogs.length > 100) {
    recentMailLogs.length = 100;
  }

  // Execute directly so serverless route contexts reliably complete delivery
  try {
    const res = await processMailPayload(fullPayload);
    if (res.success) {
      await incrementTodaySentCount();
      logEntry.status = 'COMPLETED';
      logEntry.timestamp = new Date().toISOString();
      return { queued: true, jobId, success: true };
    } else {
      logEntry.status = 'FAILED';
      logEntry.error = res.error;
      logEntry.timestamp = new Date().toISOString();
      return { queued: true, jobId, success: false, error: res.error };
    }
  } catch (err: any) {
    console.error('[Registration Mail Delivery Error]:', err?.message);
    logEntry.status = 'FAILED';
    logEntry.error = err?.message;
    logEntry.timestamp = new Date().toISOString();
    return { queued: true, jobId, success: false, error: err?.message };
  }
}

/**
 * Enqueue broadcast email batch with smooth spacing (1s gap between emails)
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
  const PACE_DELAY_MS = 1000; // 1 second spacing for safe inbox delivery

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
