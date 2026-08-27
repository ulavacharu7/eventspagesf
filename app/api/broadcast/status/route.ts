import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTodaySentCount, DAILY_LIMIT, recentMailLogs } from '@/lib/mailQueue';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email') || searchParams.get('organizerEmail');

    const sentToday = await getTodaySentCount();
    const remainingToday = Math.max(0, DAILY_LIMIT - sentToday);

    const whereClause: any = {};
    if (email && email.trim()) {
      whereClause.OR = [
        { createdByEmail: { equals: email.trim().toLowerCase(), mode: 'insensitive' } },
        { createdByEmail: { equals: email.trim() } },
      ];
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        startDate: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const eventIds = events.map((e) => e.id);

    let totalAttendees = 0;
    if (email && email.trim()) {
      // For a specific organizer, count unique registered attendees for their events
      const organizerRegs = await prisma.registration.findMany({
        where: { eventId: { in: eventIds } },
        select: { email: true },
      });
      const uniqueEmails = new Set<string>();
      organizerRegs.forEach((r) => r.email && uniqueEmails.add(r.email.trim().toLowerCase()));
      totalAttendees = uniqueEmails.size;
    } else {
      // Global platform count (Super Admin)
      const [users, registrations] = await Promise.all([
        prisma.user.findMany({ select: { email: true } }),
        prisma.registration.findMany({ select: { email: true } }),
      ]);
      const uniqueEmails = new Set<string>();
      users.forEach((u) => u.email && uniqueEmails.add(u.email.trim().toLowerCase()));
      registrations.forEach((r) => r.email && uniqueEmails.add(r.email.trim().toLowerCase()));
      totalAttendees = uniqueEmails.size;
    }

    return NextResponse.json({
      dailyLimit: DAILY_LIMIT,
      sentToday,
      remainingToday,
      totalAttendees,
      events,
      logs: recentMailLogs.slice(0, 30),
    });
  } catch (err: any) {
    console.error('Broadcast status error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to fetch broadcast status.' }, { status: 500 });
  }
}
