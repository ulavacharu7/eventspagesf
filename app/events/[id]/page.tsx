import React from 'react';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import EventDetailClient from './EventDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

function getValidEventImageUrl(coverImage?: string | null, eventTitle?: string | null, eventId?: string | null): string {
  const fallback = 'https://ik.imagekit.io/dypkhqxip/events%20by%20main.png';
  if (!coverImage) {
    const titleLower = (eventTitle || '').toLowerCase();
    if (eventId === 'cmsbpnls8000004lfw3buf1a7' || titleLower.includes('student forge') || titleLower.includes('platform launch')) {
      return 'https://ik.imagekit.io/dypkhqxip/mainbannersf';
    }
    return fallback;
  }

  const trimmed = coverImage.trim();
  if (trimmed.startsWith('data:')) {
    return eventId 
      ? `https://events.studentforge.in/api/events/${eventId}/og-image`
      : fallback;
  }

  const firstUrl = trimmed.split(',')[0].trim();
  if (!firstUrl) return fallback;

  if (firstUrl.startsWith('http://') || firstUrl.startsWith('https://')) {
    return firstUrl;
  }

  if (firstUrl.startsWith('/')) {
    return `https://events.studentforge.in${firstUrl}`;
  }

  return `https://${firstUrl}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return {
        title: 'Event Not Found | StudentForge',
        description: 'The requested campus event could not be found.',
      };
    }

    const imageUrl = getValidEventImageUrl(event.coverImage, event.title, event.id);

    return {
      title: `${event.title} | StudentForge`,
      description: event.description 
        ? event.description.substring(0, 160) 
        : 'RSVP for college workshops, student tech meetups, and campus gatherings with custom check-in QR passes.',
      openGraph: {
        title: `${event.title} | StudentForge`,
        description: event.description ? event.description.substring(0, 160) : 'Register for this campus event on StudentForge.',
        url: `https://events.studentforge.in/events/${id}`,
        siteName: 'StudentForge Events',
        images: [
          {
            url: imageUrl,
            secureUrl: imageUrl,
            width: 1200,
            height: 630,
            alt: event.title || 'Event Cover Image',
          },
        ],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${event.title} | StudentForge`,
        description: event.description ? event.description.substring(0, 160) : 'Register for this campus event on StudentForge.',
        images: [imageUrl],
      },
    };
  } catch (error) {
    return {
      title: 'Event | StudentForge',
      description: 'RSVP for college workshops, student tech meetups, and campus gatherings with custom check-in QR passes.',
    };
  }
}

export default async function EventPage({ params }: Props) {
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });

  // Render the Client Component and pass down preloaded event data
  return <EventDetailClient eventId={id} initialEvent={JSON.parse(JSON.stringify(event))} />;
}

