'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PixelBlast from '@/components/PixelBlast';
import Grainient from '@/components/Grainient';
import { EventData } from '@/lib/eventsStore';
import {
  GoCalendar,
  GoLocation,
  GoPeople,
  GoArrowLeft,
  GoPerson,
  GoCheck,
  GoArrowUpRight,
  GoClock,
  GoShareAndroid,
  GoCopy,
  GoShieldCheck,
  GoChevronRight,
  GoZap,
  GoTag,
} from 'react-icons/go';
import { ShinyButton } from '@/components/ui/shiny-button';
import { useViewerCount } from '@/lib/useViewerCount';
import { DotmSquare5 } from '@/components/ui/dotm-square-5';
import { isEventCompleted } from '@/lib/utils';

const GoogleDriveLogo = ({ className = "w-5 h-5" }: { className?: string }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.71 3.5H16.29L19.72 9.5L13.15 21H4.58L7.71 3.5Z" fill="#FFC107" />
        <path d="M1.15 15L4.58 9.5L7.71 3.5H16.29L12.86 9.5L6.29 21H1.15Z" fill="#0066DA" />
        <path d="M7.71 3.5L11.14 9.5H19.72L16.29 3.5H7.71Z" fill="#00AC47" />
        <path d="M19.72 9.5L13.15 21H22.85L19.72 9.5Z" fill="#EA4335" />
        <path d="M19.72 9.5H11.14L4.58 21H13.15L19.72 9.5Z" fill="#2684FC" />
      </svg>
    );
  }

  return (
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg"
      alt="Google Drive"
      width={20}
      height={20}
      className={`${className} object-contain`}
      onError={() => setHasError(true)}
    />
  );
};

const themes = [
  { name: 'Minimal', bg: 'bg-[#f4f4f5]', textColor: 'text-black', subText: '*HOW LUCKY YOU ARE' },
  { name: 'Quantum', bg: 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600', textColor: 'text-white', subText: '*BUILD THE UNKNOWN' },
  { name: 'Warp', bg: 'bg-black border border-[#2e2e34]', textColor: 'text-white', subText: '*JOIN THE FUTURE' },
  { name: 'Emoji', bg: 'bg-[#b497cf]', textColor: 'text-white', subText: '*STUDENT FORGE EVENTS' },
  { name: 'Confetti', bg: 'bg-gradient-to-tr from-purple-600 to-pink-500', textColor: 'text-white', subText: '*PARTY TIME' },
  { name: 'Pattern', bg: 'bg-gradient-to-tr from-indigo-600 to-teal-600', textColor: 'text-white', subText: '*PATTERN CREATION' },
  { name: 'Seasonal', bg: 'bg-gradient-to-tr from-rose-500 to-amber-500', textColor: 'text-white', subText: '*CREATORS GATHERING' },
  { name: 'PixelBlast', bg: 'bg-[#141416]', textColor: 'text-[#B497CF]', subText: '*PIXELBLAST INTERACTIVE' },
  { name: 'Grainient', bg: 'bg-transparent', textColor: 'text-[#FF9FFC]', subText: '*GRAINIENT ANIMATED' }
];

const getPageFontFamilyClass = (fontName: string | undefined) => {
  switch (fontName) {
    case 'Serif': return 'font-serif';
    case 'Mono': return 'font-mono';
    case 'Display': return 'font-sans font-medium';
    default: return 'font-sans';
  }
};

function rgbToSoftHex(r: number, g: number, b: number): string {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  s = 0.75;
  l = 0.65;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const newR = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
  const newG = Math.round(hue2rgb(p, q, h) * 255);
  const newB = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);

  const toHex = (c: number) => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}

function getFallbackSoftColor(headerBg: string | undefined): string {
  if (!headerBg) return '#818cf8';
  const clean = headerBg.toLowerCase();
  if (clean.includes('818cf8')) return '#818cf8';
  if (clean.includes('fef08a') || clean.includes('ffe600')) return '#fde047';
  if (clean.includes('6ee7b7')) return '#6ee7b7';
  if (clean.includes('fbcfe8')) return '#f472b6';
  if (clean.includes('fed7aa')) return '#fb923c';
  return '#818cf8';
}

function buildGoogleCalendarUrl(event: EventData): string {
  const title = encodeURIComponent(event.title || 'Event');
  const details = encodeURIComponent(event.description || 'StudentForge Event');
  const location = encodeURIComponent(event.location || '');

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
}

interface EventDetailClientProps {
  eventId: string;
  initialEvent: EventData | null;
}

export default function EventDetailClient({ eventId, initialEvent }: EventDetailClientProps) {
  const router = useRouter();
  const [event, setEvent] = useState<EventData | null>(initialEvent);
  const [loading, setLoading] = useState(!initialEvent);
  const [registered, setRegistered] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [registrationsCount, setRegistrationsCount] = useState<number>(0);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [extractedColor, setExtractedColor] = useState<string>('#818cf8');
  const [copiedToast, setCopiedToast] = useState(false);
  const [copiedAddressToast, setCopiedAddressToast] = useState(false);
  const viewerCount = useViewerCount(eventId);

  const parseCapacity = (capStr?: string): number | null => {
    if (!capStr) return null;
    const clean = capStr.toLowerCase().trim();
    if (clean.includes('unlimited') || clean === '0' || clean === '') return null;
    const match = capStr.match(/\d+/);
    if (match) {
      const num = parseInt(match[0], 10);
      return isNaN(num) || num <= 0 ? null : num;
    }
    return null;
  };

  const maxCapacity = parseCapacity(event?.capacity);
  const isLimited = maxCapacity !== null;
  const actualRemaining = isLimited ? Math.max(0, maxCapacity - registrationsCount) : null;
  const isFull = isLimited && actualRemaining === 0;

  const getDisplayRemaining = (actual: number | null): number | null => {
    if (actual === null) return null;
    if (actual <= 0) return 0;
    return Math.max(1, 30 - registrationsCount);
  };

  const displayTicketsLeft = getDisplayRemaining(actualRemaining);

  const isStudentForgeLaunch =
    event?.id === 'cmsbpnls8000004lfw3buf1a7' ||
    (event?.title && (
      event.title.toLowerCase().includes('student forge') ||
      event.title.toLowerCase().includes('platform launch')
    ));

  useEffect(() => {
    if (!event?.coverImage) {
      setExtractedColor(getFallbackSoftColor(event?.headerBg));
      return;
    }

    const img = new Image();
    if (!event.coverImage.startsWith('data:')) {
      img.crossOrigin = 'Anonymous';
    }
    img.src = event.coverImage;
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 10;
        canvas.height = 10;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, 10, 10);
        const data = ctx.getImageData(0, 0, 10, 10).data;

        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 4) {
          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
          if (brightness > 15 && brightness < 240) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
          }
        }
        if (count > 0) {
          r = Math.round(r / count);
          g = Math.round(g / count);
          b = Math.round(b / count);
          setExtractedColor(rgbToSoftHex(r, g, b));
        } else {
          setExtractedColor(getFallbackSoftColor(event?.headerBg));
        }
      } catch (e) {
        console.warn('Color extraction fallback:', e);
        setExtractedColor(getFallbackSoftColor(event?.headerBg));
      }
    };
    img.onerror = () => {
      setExtractedColor(getFallbackSoftColor(event?.headerBg));
    };
  }, [event?.coverImage, event?.headerBg]);

  useEffect(() => {
    if (!initialEvent && eventId) {
      setLoading(true);
      fetch(`/api/events/${eventId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.event) setEvent(data.event);
        })
        .catch((err) => console.error('Failed to load event:', err))
        .finally(() => setLoading(false));
    }

    let currentUserEmail: string | null = null;
    try {
      const stored = localStorage.getItem('student_forge_user');
      if (stored) {
        const u = JSON.parse(stored);
        setUser(u);
        currentUserEmail = u?.email || null;
      }
    } catch (e) {
      console.error(e);
    }

    if (eventId) {
      fetch(`/api/events/${eventId}/register`)
        .then((r) => r.json())
        .then((data) => {
          const regs = data.registrations || [];
          setRegistrationsCount(regs.length);
          if (currentUserEmail) {
            const isReg = regs.some((r: any) => r.email === currentUserEmail);
            setRegistered(isReg);
          }
        })
        .catch((err) => console.error('Failed to load registrations:', err));
    }
  }, [eventId, initialEvent]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2000);
    }
  };

  const handleCopyAddress = () => {
    if (event?.location && typeof window !== 'undefined') {
      navigator.clipboard.writeText(event.location);
      setCopiedAddressToast(true);
      setTimeout(() => setCopiedAddressToast(false), 2000);
    }
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share && event) {
      try {
        await navigator.share({
          title: event.title,
          text: `Check out ${event.title} on StudentForge!`,
          url: window.location.href,
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const isInceptEvent = event?.title ? event.title.toLowerCase().includes('incept') : false;
  const isIncept01PartnersEvent = event?.title
    ? (event.title.toLowerCase().includes('incept') &&
      (event.title.toLowerCase().includes('01') || event.title.toLowerCase().includes('edition - 01') || event.title.toLowerCase().includes('edition 1') || event.title.toLowerCase().includes('edition-01')) &&
      !event.title.toLowerCase().includes('episode - i i') &&
      !event.title.toLowerCase().includes('episode ii') &&
      !event.title.toLowerCase().includes('episode - 2') &&
      !event.title.toLowerCase().includes('episode 2'))
    : false;

  const eventEnded = event ? isEventCompleted(event) : false;

  const parsedSpeakers = useMemo(() => {
    if (!event?.speakers) return [];
    try {
      return JSON.parse(event.speakers) as { name: string; role: string; image?: string | null }[];
    } catch {
      return [];
    }
  }, [event?.speakers]);

  const parsedCustomFields = useMemo(() => {
    if (!event?.customFields) return [];
    try {
      return JSON.parse(event.customFields) as { id: string; label: string; type: string; required?: boolean; options?: string[] }[];
    } catch {
      return [];
    }
  }, [event?.customFields]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#111113] text-white flex flex-col justify-between antialiased font-tight select-none">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-24 px-4">
          <DotmSquare5 size={36} dotSize={4} speed={1.2} bloom colorPreset="grad-aurora" animated />
          <p className="text-xs text-white/50 font-mono tracking-wider uppercase">Loading Event Experience...</p>
        </div>
        <Footer />
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-[#111113] text-white flex flex-col justify-between antialiased font-tight select-none">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-5 py-24 px-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl">
            <GoCalendar className="w-8 h-8 text-white/40" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white">Event Not Found</h2>
            <p className="text-xs text-white/50 mt-1.5 max-w-sm leading-relaxed">
              This event may have concluded, been unlisted, or the link provided is invalid.
            </p>
          </div>
          <a
            href="/events"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#101010] font-semibold rounded-xl text-xs hover:bg-neutral-200 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <GoArrowLeft className="w-4 h-4" />
            <span>Browse All Events</span>
          </a>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main
      className={`min-h-screen bg-[#0e0e10] text-white flex flex-col justify-between antialiased relative overflow-hidden font-tight select-none ${getPageFontFamilyClass(event.font)}`}
      style={{
        ['--event-highlight' as any]: extractedColor,
        ['--event-highlight-bg' as any]: `${extractedColor}1a`,
        ['--event-highlight-glow' as any]: `${extractedColor}33`,
      }}
    >
      {/* Dynamic Ambient Background Aura */}
      <div
        className="pointer-events-none fixed -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[550px] rounded-full blur-[140px] opacity-25 z-0 transition-all duration-1000"
        style={{ background: `radial-gradient(circle, ${extractedColor} 0%, transparent 70%)` }}
      />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.12),rgba(255,255,255,0))] z-0" />

      {/* Interactive Theme Backgrounds for Custom Fallbacks */}
      {!event.coverImage && event.themeIdx !== undefined && themes[event.themeIdx] && (
        event.themeIdx === 7 ? (
          <div className="fixed inset-0 z-0 opacity-80 pointer-events-none">
            <PixelBlast
              variant="circle"
              pixelSize={6}
              color="#B497CF"
              patternScale={3}
              patternDensity={1.2}
              pixelSizeJitter={0.5}
              enableRipples
              rippleSpeed={0.4}
              rippleThickness={0.12}
              rippleIntensityScale={1.5}
              liquid
              liquidStrength={0.12}
              liquidRadius={1.2}
              liquidWobbleSpeed={5}
              speed={0.6}
              edgeFade={0.25}
              transparent
            />
          </div>
        ) : event.themeIdx === 8 ? (
          <div className="fixed inset-0 z-0 pointer-events-none">
            <Grainient
              color1="#FF9FFC"
              color2="#5227FF"
              color3="#B497CF"
              timeSpeed={0.25}
              colorBalance={0.0}
              warpStrength={1.0}
              warpFrequency={5.0}
              warpSpeed={2.0}
              warpAmplitude={50.0}
              blendAngle={0.0}
              blendSoftness={0.05}
              rotationAmount={500.0}
              noiseScale={2.0}
              grainAmount={0.1}
              grainScale={2.0}
              grainAnimated={false}
              contrast={1.5}
              gamma={1.0}
              saturation={1.0}
              centerX={0.0}
              centerY={0.0}
              zoom={0.9}
            />
          </div>
        ) : (
          <div className={`fixed inset-0 z-0 opacity-40 pointer-events-none ${themes[event.themeIdx].bg}`} />
        )
      )}

      <Navbar />

      {/* Main Content Container */}
      <div className="w-full max-w-6xl mx-auto pt-8 sm:pt-12 md:pt-14 pb-24 px-4 sm:px-6 flex-1 flex flex-col gap-8 relative z-10">

        {/* Top Header Breadcrumb & Quick Actions Bar */}
        <div className="flex items-center justify-between gap-4 pb-2">
          <nav className="flex items-center gap-2 text-xs text-white/50 font-normal">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span className="text-white/20">/</span>
            <a href="/events" className="hover:text-white transition-colors">Events</a>
            <span className="text-white/20">/</span>
            <span className="text-white/90 font-medium truncate max-w-[140px] sm:max-w-xs">{event.title}</span>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-medium transition-all shadow-sm active:scale-95 cursor-pointer"
              title="Share event link"
            >
              <GoShareAndroid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-medium transition-all shadow-sm active:scale-95 cursor-pointer relative"
              title="Copy event link"
            >
              <GoCopy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{copiedToast ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Cinematic Bento Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

          {/* Left Column: 1:1 Event Poster + Action Toolbar */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="relative group w-full aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-950 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all duration-500">
              
              {/* Event Poster Image or Themed Card */}
              {event.coverImage ? (
                <img
                  src={event.coverImage}
                  alt={event.title}
                  width={1200}
                  height={1200}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="w-full h-full flex flex-col justify-between p-8 sm:p-10 relative overflow-hidden bg-neutral-900 text-white">
                  <div className="flex flex-col gap-3 z-10">
                    <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-white/60">
                      {event.calendarType || 'Student Forge Gathering'}
                    </span>
                    <h2 className="font-instrument-serif text-3xl sm:text-5xl font-normal leading-[0.98] tracking-tight line-clamp-4">
                      {event.title}
                    </h2>
                  </div>
                  <div className="flex flex-col gap-1 pt-6 border-t border-white/15 z-10">
                    <span className="text-xs font-mono tracking-widest text-white/70">{event.startDate} · {event.startTime}</span>
                    <span className="text-xs font-mono tracking-widest text-white/70 truncate">{event.location}</span>
                  </div>
                </div>
              )}

              {/* Floating Status Badges on Poster */}
              <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none z-20">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider bg-black/60 backdrop-blur-md border border-white/20 text-white font-semibold px-2.5 py-1 rounded-full shadow-lg">
                    {event.calendarType || 'Event'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Live viewer count */}
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase bg-black/65 backdrop-blur-md border border-emerald-500/30 text-emerald-400 font-semibold px-2.5 py-1 rounded-full shadow-lg">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                    </span>
                    {viewerCount} {viewerCount === 1 ? 'viewer' : 'viewers'}
                  </span>
                </div>
              </div>

              {/* Bottom Subtle Gradient Over Poster */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              {/* Availability Chip at bottom left of poster */}
              <div className="absolute bottom-3.5 left-3.5 z-20">
                {eventEnded ? (
                  <span className="text-[10px] font-mono uppercase tracking-wider bg-neutral-900/90 backdrop-blur-md border border-white/20 text-white/60 font-semibold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                    <GoClock className="w-3 h-3 text-white/40" />
                    <span>Concluded</span>
                  </span>
                ) : isFull ? (
                  <span className="text-[10px] font-mono uppercase tracking-wider bg-rose-500/20 backdrop-blur-md border border-rose-500/40 text-rose-300 font-semibold px-3 py-1 rounded-full shadow-lg">
                    Sold Out · Waitlist Open
                  </span>
                ) : (
                  <span className="text-[10px] font-mono uppercase tracking-wider bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-emerald-300 font-semibold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>RSVP Open</span>
                  </span>
                )}
              </div>
            </div>

            {/* Poster Quick-Actions Sub-Bar */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={buildGoogleCalendarUrl(event)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/80 hover:text-white text-xs font-medium transition-all shadow-sm hover:scale-[1.01] active:scale-95 cursor-pointer"
              >
                <GoCalendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Add to Google Calendar</span>
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/80 hover:text-white text-xs font-medium transition-all shadow-sm hover:scale-[1.01] active:scale-95 cursor-pointer"
              >
                <GoShareAndroid className="w-3.5 h-3.5 text-emerald-400" />
                <span>{copiedToast ? 'Link Copied!' : 'Share with Friends'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Title, Quick Specs, and Sticky Registration Console */}
          <div className="lg:col-span-6 flex flex-col gap-6">

            {/* Event Title & Host Chip */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-white/50 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-md">
                  {event.visibility || 'Public'} Event
                </span>
                {event.requireApproval && (
                  <span className="text-[11px] font-mono uppercase tracking-wider text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-md">
                    Host Approval Required
                  </span>
                )}
              </div>

              <h1 className="font-instrument-serif text-3xl sm:text-4xl lg:text-5xl text-white font-normal tracking-[-0.6px] leading-[1.12]">
                {event.title}
              </h1>

              {/* Host Chip */}
              <div className="flex items-center gap-3 pt-1">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 p-[1.5px] shrink-0 shadow-md">
                  <div className="w-full h-full rounded-full bg-[#161618] flex items-center justify-center text-xs font-bold text-white uppercase font-mono">
                    {(event.organizer || 'Student Forge').charAt(0)}
                  </div>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">Hosted by</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-semibold text-white truncate">{event.organizer || 'Student Forge'}</span>
                    <GoShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" title="Verified Host" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Quick-Fact Cards (Date & Venue) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Date Card */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md flex flex-col justify-between gap-3 shadow-lg hover:border-white/20 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <GoCalendar className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono uppercase text-white/40">Date &amp; Time</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white tracking-tight">{event.startDate}</span>
                  <span className="text-xs font-mono text-white/60 mt-0.5">
                    {event.startTime}{event.endTime ? ` – ${event.endTime}` : ''}
                  </span>
                </div>
              </div>

              {/* Location Card */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md flex flex-col justify-between gap-3 shadow-lg hover:border-white/20 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <GoLocation className="w-4 h-4" />
                  </div>
                  {event.location && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 transition-colors cursor-pointer"
                    >
                      <span>Maps</span>
                      <GoArrowUpRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white tracking-tight truncate">
                    {event.location ? event.location.split(',')[0] : 'Online / Virtual'}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="text-[11px] text-white/50 hover:text-white text-left truncate transition-colors mt-0.5 cursor-pointer flex items-center gap-1"
                    title="Click to copy full address"
                  >
                    <span>{copiedAddressToast ? 'Address Copied!' : (event.location || 'Virtual Link via Email')}</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Registration Glass Console */}
            <div className="p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#1c1c22]/95 to-[#141418]/95 border border-white/15 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-5 relative overflow-hidden">
              
              {/* Top Specular Accent Highlight */}
              <div
                className="absolute top-0 left-0 right-0 h-[1.5px]"
                style={{ background: `linear-gradient(90deg, transparent, ${extractedColor}, transparent)` }}
              />

              <div className="flex items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-white/40 font-semibold">
                    Ticket Price
                  </span>
                  <div className="flex items-baseline gap-2.5">
                    {(event.price === '199' || event.price === '₹199' || isInceptEvent) && (
                      <span className="text-base sm:text-lg text-white/35 line-through font-mono">
                        ₹249
                      </span>
                    )}
                    <span className="font-instrument-serif text-3xl sm:text-4xl text-white font-normal leading-none">
                      {event.price?.startsWith('₹') ? event.price : (event.price === 'Free' || !event.price ? 'Free' : `₹${event.price}`)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-mono uppercase text-white/40">Capacity</span>
                  <span className="text-xs font-semibold font-mono text-white/80">
                    {event.capacity || 'Unlimited'} Seats
                  </span>
                </div>
              </div>

              {/* Capacity Progress Bar if limited */}
              {isLimited && (
                <div className="flex flex-col gap-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-white/60">
                    <span>Availability</span>
                    <span className={isFull ? 'text-rose-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                      {isFull ? '0 tickets left' : `${displayTicketsLeft} tickets left`}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isFull ? 'bg-rose-500' : 'bg-gradient-to-r from-indigo-500 to-emerald-400'}`}
                      style={{
                        width: `${Math.min(100, Math.max(5, ((registrationsCount) / (maxCapacity || 30)) * 100))}%`
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Action State Button */}
              <div className="flex flex-col gap-3 pt-2">
                {eventEnded ? (
                  <div className="flex flex-col gap-2">
                    <div className="w-full py-3.5 bg-white/5 border border-white/10 text-white/40 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed select-none shadow-inner">
                      <GoClock className="w-4 h-4 text-white/40" />
                      <span>Event Concluded · Registration Closed</span>
                    </div>
                    <p className="text-[11px] text-white/40 text-center leading-relaxed">
                      This event has already taken place. Check our events directory for upcoming gatherings.
                    </p>
                  </div>
                ) : registered ? (
                  <div className="flex flex-col gap-2.5">
                    <div className="w-full py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm">
                      <GoCheck className="w-4 h-4 text-emerald-400" />
                      <span>You Are Registered for this Event</span>
                    </div>
                    <a
                      href={`/events/${event.id}/register`}
                      className="w-full py-3.5 bg-white hover:bg-neutral-100 text-[#101010] text-xs font-bold rounded-xl text-center shadow-lg active:scale-[0.99] transition-all cursor-pointer block"
                    >
                      View Your Ticket Pass
                    </a>
                  </div>
                ) : isFull ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (!user) {
                        router.push('/auth');
                      } else {
                        router.push(`/events/${event.id}/register?waitlist=true`);
                      }
                    }}
                    className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:brightness-110 text-white text-xs font-bold rounded-xl shadow-lg shadow-amber-500/20 active:scale-[0.99] transition-all cursor-pointer"
                  >
                    {user ? 'Join Waitlist' : 'Sign In to Join Waitlist'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (!user) {
                        router.push('/auth');
                      } else {
                        router.push(`/events/${event.id}/register`);
                      }
                    }}
                    className="w-full py-3.5 bg-white hover:bg-neutral-100 text-[#101010] text-xs font-bold rounded-xl shadow-[0_4px_20px_rgba(255,255,255,0.15)] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{user ? 'Register for Event' : 'Sign Up to Register'}</span>
                    <GoArrowUpRight className="w-4 h-4" />
                  </button>
                )}

                {!registered && !eventEnded && (
                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-white/40 pt-0.5">
                    <GoZap className="w-3 h-3 text-indigo-400" />
                    <span>
                      {event.requireApproval
                        ? 'Host will review and confirm your pass upon RSVP'
                        : 'Instant confirmation · Digital QR Pass delivered immediately'}
                    </span>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* Detailed Sections (About, Custom Fields, Speakers, Media, Partners) */}
        <div className="flex flex-col gap-8 pt-4">

          {/* About Event Card */}
          <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl shadow-xl flex flex-col gap-4">
            <h3 className="font-instrument-serif text-2xl sm:text-3xl text-white font-normal tracking-[-0.4px]">
              About the Event
            </h3>
            <div className="flex flex-col gap-2.5">
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed whitespace-pre-wrap font-normal">
                {event.description
                  ? (isDescExpanded || event.description.length <= 380
                    ? event.description
                    : `${event.description.substring(0, 380)}...`)
                  : 'No detailed description provided for this event.'}
              </p>
              {event.description && event.description.length > 380 && (
                <button
                  type="button"
                  onClick={() => setIsDescExpanded(!isDescExpanded)}
                  className="text-xs font-semibold text-white hover:text-indigo-300 transition-colors text-left underline underline-offset-4 cursor-pointer mt-1 py-1 block outline-none select-none"
                >
                  {isDescExpanded ? 'Read Less' : 'Read Full Description'}
                </button>
              )}
            </div>

            {/* Custom Fields Highlights (if any) */}
            {parsedCustomFields.length > 0 && (
              <div className="pt-4 border-t border-white/10 flex flex-wrap gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 w-full mb-1">
                  Registration Requirements
                </span>
                {parsedCustomFields.map((cf) => (
                  <span
                    key={cf.id}
                    className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/80"
                  >
                    <GoTag className="w-3 h-3 text-indigo-400" />
                    <span>{cf.label}</span>
                    {cf.required && <span className="text-amber-400 text-[10px]">*</span>}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Speakers Section */}
          {parsedSpeakers.length > 0 && (
            <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl shadow-xl flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex flex-col gap-0.5">
                  <h3 className="font-instrument-serif text-2xl sm:text-3xl text-white font-normal tracking-[-0.4px]">
                    Featured Speakers &amp; Mentors
                  </h3>
                  <p className="text-xs text-white/50">Industry leaders and domain experts leading this session</p>
                </div>
                <span className="text-[10px] font-mono text-white/40 uppercase bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">
                  {parsedSpeakers.length} Speaker{parsedSpeakers.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 pt-2">
                {parsedSpeakers.map((sp, idx) => (
                  <div
                    key={idx}
                    className="group p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.06] transition-all flex flex-col items-center text-center relative"
                  >
                    <div className="relative p-1 rounded-full bg-gradient-to-tr from-indigo-500/40 to-purple-500/40 group-hover:from-indigo-500 group-hover:to-purple-500 transition-all duration-300 shadow-xl">
                      {sp.image ? (
                        <img
                          src={sp.image}
                          alt={sp.name}
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#16161a] border border-white/10 flex items-center justify-center text-2xl font-bold text-white select-none">
                          {sp.name.substring(0, 1).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-white tracking-tight mt-3.5 leading-snug">
                      {sp.name}
                    </h4>

                    <p className="text-[11px] text-white/50 font-mono mt-1 leading-relaxed line-clamp-2">
                      {sp.role}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grab Pics & Videos Container Card (ONLY for Student Forge Launch) */}
          {isStudentForgeLaunch && (
            <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl shadow-xl flex flex-col gap-5">
              <div className="flex flex-col gap-0.5">
                <h3 className="font-instrument-serif text-2xl sm:text-3xl text-white font-normal tracking-tight">
                  Grab Pics &amp; Videos from Launch
                </h3>
                <p className="text-xs text-white/50">Official high-resolution media repository hosted on Google Drive</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href="https://drive.google.com/drive/folders/1LdhVFoQzA6jnRYVbVB4ySX0QMugT8RF0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-white/20 text-white transition-all group cursor-pointer shadow-md hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0 shadow-inner">
                      <GoogleDriveLogo className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs sm:text-sm font-semibold text-white tracking-wide">Event Photos</span>
                      <span className="text-[10px] text-white/40 font-mono">Google Drive Folder</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-white/50 group-hover:text-white font-mono flex-shrink-0 ml-2">
                    <span className="text-[10px] hidden sm:inline">View Photos</span>
                    <GoArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </a>

                <a
                  href="https://drive.google.com/drive/folders/1gFOufUzi2rcsWjvtN1xkBciV-f8KeM9N"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-white/20 text-white transition-all group cursor-pointer shadow-md hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0 shadow-inner">
                      <GoogleDriveLogo className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs sm:text-sm font-semibold text-white tracking-wide">Event Videos</span>
                      <span className="text-[10px] text-white/40 font-mono">Google Drive Folder</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-white/50 group-hover:text-white font-mono flex-shrink-0 ml-2">
                    <span className="text-[10px] hidden sm:inline">View Videos</span>
                    <GoArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </a>
              </div>
            </div>
          )}

          {/* Standalone Official Event Partners Card (ONLY for Incept Edition 01) */}
          {isIncept01PartnersEvent && (
            <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl shadow-xl flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Official Event Partners</h4>
                </div>
                <span className="text-[10px] font-mono text-white/60 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">Collaborators</span>
              </div>

              {/* Networking Partner: Peopld */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-white/40 font-semibold flex items-center gap-1">
                  Networking Partner
                </span>
                <a
                  href="https://www.peopld.in/event/incept-edition-01-50ca84e6/register"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3.5 p-3.5 bg-white/95 hover:bg-white border border-white rounded-xl shadow-md transition-all hover:scale-[1.01] group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="h-14 min-w-[120px] px-2 py-0.5 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-inner overflow-hidden">
                      <img
                        src="https://ik.imagekit.io/dypkhqxip/peopld"
                        alt="Peopld Networking Partner"
                        className="h-14 w-auto object-contain max-w-[180px] sm:max-w-[220px] scale-140 transform-gpu"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-neutral-900 leading-tight group-hover:text-amber-600 transition-colors">Peopld Pass Portal</span>
                      <span className="text-[11px] text-neutral-600 font-medium truncate">Incept Edition - 01 Official Registration</span>
                    </div>
                  </div>
                  <div className="px-3 py-1.5 bg-amber-500 text-black text-xs font-bold rounded-lg flex items-center gap-1 shrink-0 group-hover:bg-amber-400 transition-colors shadow-sm">
                    <span>Get Pass</span>
                    <GoArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </a>
              </div>

              {/* Marketplace / Vendor Partners */}
              <div className="flex flex-col gap-2 pt-1">
                <span className="text-[10px] uppercase font-mono tracking-widest text-white/40 font-semibold flex items-center gap-1">
                  Marketplace Partners
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="w-full h-14 bg-white/95 border border-white rounded-xl shadow-md p-2 flex items-center justify-center transition-transform hover:scale-[1.01]">
                    <img
                      src="https://ik.imagekit.io/dypkhqxip/yemnestnavbar.webp"
                      alt="Yem nest Marketplace Partner"
                      className="h-9 w-auto max-w-[110px] object-contain transform-gpu"
                      onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                    />
                  </div>

                  <div className="w-full h-14 bg-black border border-white/10 rounded-xl shadow-md p-2 flex items-center justify-center transition-transform hover:scale-[1.01]">
                    <img
                      src="https://ik.imagekit.io/dypkhqxip/ven1"
                      alt="Fitbasics Marketplace Partner"
                      className="h-9 w-auto max-w-[110px] object-contain transform-gpu"
                      onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Floating Sticky Mobile CTA Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 p-3 bg-[#111114]/90 backdrop-blur-2xl border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.6)]">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[9px] font-mono uppercase text-white/40">Admission</span>
            <div className="flex items-baseline gap-1.5">
              {(event.price === '199' || event.price === '₹199' || isInceptEvent) && (
                <span className="text-xs text-white/35 line-through font-mono">₹249</span>
              )}
              <span className="text-base font-bold text-white font-tight">
                {event.price?.startsWith('₹') ? event.price : (event.price === 'Free' || !event.price ? 'Free' : `₹${event.price}`)}
              </span>
            </div>
          </div>

          <div className="flex-1 max-w-[200px]">
            {eventEnded ? (
              <div className="w-full py-2.5 bg-white/5 border border-white/10 text-white/40 text-[11px] font-semibold rounded-xl text-center cursor-not-allowed">
                Concluded
              </div>
            ) : registered ? (
              <a
                href={`/events/${event.id}/register`}
                className="w-full py-2.5 bg-white text-[#101010] text-[11px] font-bold rounded-xl text-center block shadow-md"
              >
                View Pass
              </a>
            ) : isFull ? (
              <button
                type="button"
                onClick={() => {
                  if (!user) router.push('/auth');
                  else router.push(`/events/${event.id}/register?waitlist=true`);
                }}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[11px] font-bold rounded-xl shadow-md text-center"
              >
                Join Waitlist
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (!user) router.push('/auth');
                  else router.push(`/events/${event.id}/register`);
                }}
                className="w-full py-2.5 bg-white text-[#101010] text-[11px] font-bold rounded-xl shadow-md text-center flex items-center justify-center gap-1"
              >
                <span>Register</span>
                <GoChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
