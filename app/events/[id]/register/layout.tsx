import React from 'react';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
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

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return {
        title: 'Register for Event | StudentForge',
        description: 'RSVP for campus workshops, student hackathons, and gatherings.',
      };
    }

    const imageUrl = getValidEventImageUrl(event.coverImage, event.title, event.id);

    return {
      title: `Register for ${event.title} | StudentForge`,
      description: event.description 
        ? `Register for ${event.title}. ${event.description.substring(0, 140)}`
        : `Book entry passes and RSVP for ${event.title} on StudentForge.`,
      openGraph: {
        title: `Register for ${event.title} | StudentForge`,
        description: event.description ? event.description.substring(0, 160) : `Book entry passes for ${event.title} on StudentForge.`,
        url: `https://events.studentforge.in/events/${id}/register`,
        siteName: 'StudentForge Events',
        images: [
          {
            url: imageUrl,
            secureUrl: imageUrl,
            width: 1200,
            height: 630,
            alt: event.title || 'Event Registration Pass',
          },
        ],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `Register for ${event.title} | StudentForge`,
        description: event.description ? event.description.substring(0, 160) : `Book entry passes for ${event.title} on StudentForge.`,
        images: [imageUrl],
      },
    };
  } catch {
    return {
      title: 'Register for Event | StudentForge',
      description: 'Book your entry pass on StudentForge.',
    };
  }
}

export default async function RegisterLayout({ children }: Props) {
  return <>{children}</>;
}
