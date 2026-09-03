import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client/index.js';
import { sendEventMail } from '../lib/mail.js';
import { sendBroadcastMail } from '../lib/broadcastMail.js';

const pool = new Pool({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('====================================================');
  console.log(' INCEPT : Episode - I I Email Dispatcher');
  console.log('====================================================\n');

  // 1. Fetch Event
  const event = await prisma.event.findFirst({
    where: {
      OR: [
        { title: { contains: 'Episode - I I', mode: 'insensitive' } },
        { title: { contains: 'Episode 2', mode: 'insensitive' } },
        { title: { contains: 'INCEPT', mode: 'insensitive' } }
      ]
    },
    orderBy: { createdAt: 'desc' }
  });

  if (!event) {
    console.error('Error: Incept Episode II event not found.');
    return;
  }

  console.log(`Found Event: ${event.title} (ID: ${event.id})`);
  console.log(`Date: ${event.startDate} at ${event.startTime} | Price: ${event.price}\n`);

  // 2. Fetch all registered attendees for Incept Episode II
  const registeredAttendees = await prisma.registration.findMany({
    where: { eventId: event.id },
    orderBy: { createdAt: 'desc' }
  });

  console.log(`\n--- PART 1: Sending Confirmed Ticket Passes to Registered Attendees (${registeredAttendees.length}) ---`);
  
  for (const [idx, reg] of registeredAttendees.entries()) {
    console.log(`\n[${idx + 1}/${registeredAttendees.length}] Sending Ticket Pass to: ${reg.name} <${reg.email}>...`);
    try {
      const res = await sendEventMail({
        to: reg.email,
        subject: `Registration Confirmed - ${event.title}`,
        event: {
          id: event.id,
          title: event.title,
          organizer: event.organizer || 'Student Forge',
          location: event.location || 'Hyderabad',
          startDate: event.startDate,
          startTime: event.startTime,
          price: reg.paymentMethod === 'Free Pass' ? 'Free Pass' : (event.price || '₹199'),
          coverImage: event.coverImage,
          headerBg: event.headerBg || '#14151c'
        },
        registration: {
          id: reg.id,
          name: reg.name,
          email: reg.email,
          ticketCode: reg.ticketCode,
          answers: reg.answers,
          paymentAccountName: reg.paymentAccountName,
          paymentMethod: reg.paymentMethod,
          paymentTxnId: reg.paymentTxnId
        },
        type: reg.status === 'PENDING' ? 'PENDING' : 'CONFIRMED',
        originUrl: 'https://events.studentforge.in'
      });
      console.log(`  -> Result: ${res.success ? 'SUCCESS (ID: ' + res.messageId + ')' : 'FAILED (' + res.error + ')'}`);
    } catch (err) {
      console.error(`  -> Exception sending to ${reg.email}:`, err.message);
    }
    // Small delay between sends
    await new Promise((r) => setTimeout(r, 1000));
  }

  // 3. Fetch Users who have not registered for Incept Episode II
  const registeredEmails = new Set(registeredAttendees.map(r => (r.email || '').toLowerCase().trim()));
  
  const allUsers = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const unregisteredUsers = allUsers.filter(u => u.email && !registeredEmails.has(u.email.toLowerCase().trim()));

  console.log(`\n--- PART 2: Sending Registration Invites to Users who haven't completed registration (${unregisteredUsers.length}) ---`);

  const eventRegisterUrl = `https://events.studentforge.in/events/${event.id}/register`;

  for (const [idx, user] of unregisteredUsers.entries()) {
    console.log(`\n[${idx + 1}/${unregisteredUsers.length}] Sending Registration Invitation to: ${user.name || 'User'} <${user.email}>...`);
    
    const inviteHtml = `
      <p style="font-size: 15px; line-height: 1.6; color: #f4f4f5; margin-bottom: 16px;">
        We noticed you haven't completed your registration for <strong>${event.title}</strong> yet!
      </p>
      
      <div style="background-color: #1a1b24; border: 1px solid #272832; border-radius: 12px; padding: 18px 20px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0; color: #ffffff; font-size: 16px;">Event Highlights:</h3>
        <p style="margin: 4px 0; color: #a1a1aa; font-size: 13px;">📅 <strong>Date:</strong> ${event.startDate} at ${event.startTime}</p>
        <p style="margin: 4px 0; color: #a1a1aa; font-size: 13px;">📍 <strong>Location:</strong> ${event.location || 'Hyderabad'}</p>
        <p style="margin: 4px 0; color: #a1a1aa; font-size: 13px;">🎟️ <strong>Admission:</strong> ${event.price || '₹199'}</p>
      </div>

      <p style="font-size: 14px; line-height: 1.6; color: #d4d4d8; margin-bottom: 24px;">
        Seats are filling fast. Secure your official ticket pass and QR entry badge by completing your registration below:
      </p>

      <div style="text-align: center; margin: 28px 0;">
        <a href="${eventRegisterUrl}" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; text-decoration: none; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 8px; display: inline-block; box-shadow: 0 4px 14px rgba(37,99,235,0.4);">
          Complete Your Registration →
        </a>
      </div>

      <p style="font-size: 12px; color: #71717a; text-align: center; margin-top: 24px;">
        If you have already registered with another email, you can safely disregard this message.
      </p>
    `;

    try {
      const res = await sendBroadcastMail({
        to: user.email,
        recipientName: user.name || 'Friend',
        subject: `Complete Your Registration for ${event.title} - Student Forge`,
        bodyHtml: inviteHtml,
        headerBannerUrl: event.coverImage || null
      });
      console.log(`  -> Result: ${res.success ? 'SUCCESS (ID: ' + res.messageId + ')' : 'FAILED (' + res.error + ')'}`);
    } catch (err) {
      console.error(`  -> Exception sending to ${user.email}:`, err.message);
    }
    // 1 second pacing between sends
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log('\n====================================================');
  console.log(' All email dispatches completed successfully!');
  console.log('====================================================\n');
}

main().then(() => pool.end());
