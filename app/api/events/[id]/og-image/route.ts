import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const event = await prisma.event.findUnique({
      where: { id },
      select: { coverImage: true, title: true },
    });

    if (!event || !event.coverImage) {
      return NextResponse.redirect(
        new URL('https://ik.imagekit.io/dypkhqxip/events%20by%20main.png', request.url),
        302
      );
    }

    const cover = event.coverImage.trim();

    // 1. If base64 data URI (decode and serve as real image binary)
    if (cover.startsWith('data:image/')) {
      const commaIndex = cover.indexOf(',');
      if (commaIndex !== -1) {
        const header = cover.substring(0, commaIndex);
        const base64Data = cover.substring(commaIndex + 1);
        const mimeType = header.split(';')[0].replace('data:', '') || 'image/jpeg';
        const buffer = Buffer.from(base64Data, 'base64');

        return new Response(buffer, {
          status: 200,
          headers: {
            'Content-Type': mimeType,
            'Content-Length': buffer.length.toString(),
            'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
          },
        });
      }
    }

    // 2. If HTTP/HTTPS URL
    const firstUrl = cover.split(',')[0].trim();
    if (firstUrl.startsWith('http://') || firstUrl.startsWith('https://')) {
      return NextResponse.redirect(firstUrl, 302);
    }

    if (firstUrl.startsWith('/')) {
      return NextResponse.redirect(
        new URL(firstUrl, 'https://events.studentforge.in'),
        302
      );
    }

    return NextResponse.redirect(
      new URL('https://ik.imagekit.io/dypkhqxip/events%20by%20main.png', request.url),
      302
    );
  } catch (error) {
    console.error('Failed to serve event og-image:', error);
    return NextResponse.redirect(
      new URL('https://ik.imagekit.io/dypkhqxip/events%20by%20main.png', request.url),
      302
    );
  }
}
