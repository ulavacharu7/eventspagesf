'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PixelBlast from '@/components/PixelBlast';
import Grainient from '@/components/Grainient';
import { EventData } from '@/lib/eventsStore';
import { GoCalendar, GoLocation, GoPeople, GoArrowLeft, GoPerson, GoCheck, GoChevronLeft, GoChevronRight, GoImage, GoVideo, GoArrowUpRight, GoTag, GoClock } from 'react-icons/go';
import { ShinyButton } from '@/components/ui/shiny-button';
import { useViewerCount } from '@/lib/useViewerCount';
import { DotmSquare5 } from '@/components/ui/dotm-square-5';
import { isEventCompleted } from '@/lib/utils';

const GoogleDriveLogo = ({ className = "w-5 h-5" }: { className?: string }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.71 3.5H16.29L19.72 9.5L13.15 21H4.58L7.71 3.5Z" fill="#FFC107"/>
        <path d="M1.15 15L4.58 9.5L7.71 3.5H16.29L12.86 9.5L6.29 21H1.15Z" fill="#0066DA"/>
        <path d="M7.71 3.5L11.14 9.5H19.72L16.29 3.5H7.71Z" fill="#00AC47"/>
        <path d="M19.72 9.5L13.15 21H22.85L19.72 9.5Z" fill="#EA4335"/>
        <path d="M19.72 9.5H11.14L4.58 21H13.15L19.72 9.5Z" fill="#2684FC"/>
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

const getHighlightColor = (bgClass: string) => {
  if (!bgClass) return 'text-[#ff6b6b]';
  const clean = bgClass.toLowerCase();
  if (clean.includes('818cf8')) return 'text-[#ff6b6b]';
  if (clean.includes('fef08a') || clean.includes('ffe600')) return 'text-[#ffe600]';
  if (clean.includes('6ee7b7')) return 'text-[#6ee7b7]';
  if (clean.includes('fbcfe8')) return 'text-[#fbcfe8]';
  if (clean.includes('fed7aa')) return 'text-[#fed7aa]';
  return 'text-[#ffe600]';
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

  // Set HSL to a soft, rich, bright range for dark mode
  s = 0.75;
  l = 0.65;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const newR = Math.round(hue2rgb(p, q, h + 1/3) * 255);
  const newG = Math.round(hue2rgb(p, q, h) * 255);
  const newB = Math.round(hue2rgb(p, q, h - 1/3) * 255);

  const toHex = (c: number) => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}

function getFallbackSoftColor(headerBg: string | undefined): string {
  if (!headerBg) return '#ff6b6b';
  const clean = headerBg.toLowerCase();
  if (clean.includes('818cf8')) return '#ff6b6b';
  if (clean.includes('fef08a') || clean.includes('ffe600')) return '#fde047';
  if (clean.includes('6ee7b7')) return '#86efac';
  if (clean.includes('fbcfe8')) return '#fbcfe8';
  if (clean.includes('fed7aa')) return '#fdba74';
  return '#ff6b6b';
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
  const [extractedColor, setExtractedColor] = useState<string>('#ff6b6b');
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
          const brightness = (data[i] + data[i+1] + data[i+2]) / 3;
          if (brightness > 15 && brightness < 240) {
            r += data[i];
            g += data[i+1];
            b += data[i+2];
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
        console.warn('Color extraction failed:', e);
        setExtractedColor(getFallbackSoftColor(event?.headerBg));
      }
    };
    img.onerror = () => {
      setExtractedColor(getFallbackSoftColor(event?.headerBg));
    };
  }, [event?.coverImage, event?.headerBg]);

  useEffect(() => {
    // If not loaded server-side, fetch it client-side
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

    // Load active session
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

    // Fetch event registrations count & check user registration status
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

  if (loading) {
    return (
      <main className="min-h-screen bg-[#161618] text-white flex flex-col justify-between antialiased font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20 px-4">
          <DotmSquare5 size={36} dotSize={4} speed={1.2} bloom colorPreset="grad-aurora" animated />
          <p className="text-xs text-neutral-500 font-mono tracking-wider uppercase">Loading event...</p>
        </div>
        <Footer />
      </main>
    );
  }

  // Not found
  if (!event) {
    return (
      <main className="min-h-screen bg-[#161618] text-white flex flex-col justify-between antialiased font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-5 py-20 px-4">
          <div className="w-14 h-14 rounded-2xl bg-[#222226] border border-[#2e2e34] flex items-center justify-center">
            <GoCalendar className="w-7 h-7 text-neutral-500" />
          </div>
          <div className="text-center">
            <h2 className="text-lg font-medium text-white">Event Not Found</h2>
            <p className="text-xs text-neutral-400 mt-1">This event may have been removed or the link is invalid.</p>
          </div>
          <a
            href="/events"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#222226] border border-[#2e2e34] rounded-md text-xs hover:bg-[#2c2c32] transition-colors"
          >
            <GoArrowLeft className="w-3.5 h-3.5" />
            Back to Events
          </a>
        </div>
        <Footer />
      </main>
    );
  }
  
  const highlightColor = getHighlightColor(event.headerBg);
  const isInceptEvent = event.title ? event.title.toLowerCase().includes('incept') : false;
  const isIncept01PartnersEvent = event.title
    ? (event.title.toLowerCase().includes('incept') &&
       (event.title.toLowerCase().includes('01') || event.title.toLowerCase().includes('edition - 01') || event.title.toLowerCase().includes('edition 1') || event.title.toLowerCase().includes('edition-01')) &&
       !event.title.toLowerCase().includes('episode - i i') &&
       !event.title.toLowerCase().includes('episode ii') &&
       !event.title.toLowerCase().includes('episode - 2') &&
       !event.title.toLowerCase().includes('episode 2'))
    : false;

  return (
    <main 
      className={`min-h-screen bg-[#161618] text-white flex flex-col justify-between antialiased relative overflow-hidden ${getPageFontFamilyClass(event.font)}`}
      style={{
        ['--event-highlight' as any]: extractedColor,
        ['--event-highlight-bg' as any]: `${extractedColor}1a`
      }}
    >
      {/* Ambient Page Background Glow based on theme */}
      {!event.coverImage && event.themeIdx !== undefined && themes[event.themeIdx] && (
        event.themeIdx === 7 ? (
          <div className="fixed inset-0 z-0 opacity-90 pointer-events-none">
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
          <div className={`fixed inset-0 z-0 opacity-90 pointer-events-none ${themes[event.themeIdx].bg}`} />
        )
      )}

      <Navbar />

      <div className="w-full max-w-6xl mx-auto pt-12 sm:pt-16 md:pt-20 pb-16 px-4 sm:px-6 flex-1 flex flex-col gap-6 relative z-10 font-tight">

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-white/50 font-normal pb-2">
          <a href="/" className="hover:text-white transition-colors">Home</a>
          <span className="text-white/20">/</span>
          <a href="/events" className="hover:text-white transition-colors">Events</a>
          <span className="text-white/20">/</span>
          <span className="text-white font-medium truncate max-w-[200px] sm:max-w-xs">{event.title}</span>
        </nav>

        {/* Top Hero Header Block */}
        <div className="flex flex-col gap-3 pb-4 border-b border-white/10">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[10px] font-mono uppercase bg-white/5 border border-white/10 text-white/70 px-2.5 py-1 rounded-md">
              {event.calendarType || 'Event'}
            </span>
            <span className="text-[10px] font-mono uppercase bg-white/5 border border-white/10 text-white/70 px-2.5 py-1 rounded-md">
              {event.visibility || 'Public'}
            </span>
            {/* Live viewer count badge */}
            <span
              className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-md shadow-[0_0_12px_rgba(16,185,129,0.15)]"
              title="People currently viewing this event"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              {viewerCount} {viewerCount === 1 ? 'viewer' : 'viewers'}
            </span>
          </div>

          <h1 className="font-instrument-serif text-3xl sm:text-4xl lg:text-5xl text-white font-normal tracking-[-0.6px] leading-[1.15]">
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-white/60">
            <span className="flex items-center gap-1.5">
              <GoCalendar className="w-3.5 h-3.5 text-white/40" />
              <span>{event.startDate}{event.startTime && ` at ${event.startTime}`}</span>
            </span>
            {event.location && (
              <span className="flex items-center gap-1.5 truncate max-w-sm">
                <GoLocation className="w-3.5 h-3.5 text-white/40 flex-shrink-0" />
                <span className="truncate">{event.location}</span>
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <GoPerson className="w-3.5 h-3.5 text-white/40" />
              <span>Hosted by <strong className="text-white font-medium">{event.organizer || 'Student Forge'}</strong></span>
            </span>
          </div>
        </div>

        {/* Outer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Content Column: Poster & Details */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* 1200x1200px 1:1 Square Event Poster */}
            <div className={`w-full aspect-square rounded-2xl sm:rounded-3xl overflow-hidden relative shadow-2xl ${
              event.coverImage 
                ? 'bg-black border border-white/10' 
                : 'bg-neutral-950/45 backdrop-blur-md border border-white/10 text-white'
            }`}>
              {event.coverImage ? (
                <img
                  src={event.coverImage}
                  alt={event.title}
                  width={1200}
                  height={1200}
                  className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-[1.01]"
                  style={{ imageRendering: 'auto' }}
                />
              ) : (
                <div className="w-full h-full flex flex-col justify-between p-8 sm:p-12 relative overflow-hidden text-white">
                  <div className="flex flex-col gap-3 z-10">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-medium opacity-60">
                      {event.calendarType || 'Student Forge Gathering'}
                    </span>
                    <h2 className="font-instrument-serif text-3xl sm:text-5xl font-normal leading-[0.95] tracking-tight line-clamp-5">
                      {event.title}
                    </h2>
                  </div>
                  <div className="flex flex-col gap-1 pt-6 border-t border-current/10 z-10">
                    <span className="text-[10px] font-mono uppercase tracking-widest opacity-60">{event.startDate} · {event.startTime}</span>
                    <span className="text-[10px] font-mono uppercase tracking-widest opacity-60 truncate">{event.location}</span>
                  </div>
                </div>
              )}
            </div>
 
            {/* Event Description Section */}
            <div className="bg-[#18181c]/80 border border-white/10 rounded-2xl p-6 sm:p-7 flex flex-col gap-4 shadow-xl">
              <h3 className="font-instrument-serif text-xl sm:text-2xl text-white font-normal tracking-[-0.4px]">
                About the Event
              </h3>
              <div className="flex flex-col gap-2">
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed whitespace-pre-wrap font-normal">
                  {event.description 
                    ? (isDescExpanded || event.description.length <= 320
                        ? event.description
                        : `${event.description.substring(0, 320)}...`)
                    : 'No detailed description provided for this event.'}
                </p>
                {event.description && event.description.length > 320 && (
                  <button
                    type="button"
                    onClick={() => setIsDescExpanded(!isDescExpanded)}
                    className="text-xs font-semibold text-white/80 hover:text-white transition-colors text-left underline underline-offset-4 cursor-pointer mt-1 py-1 block outline-none select-none"
                  >
                    {isDescExpanded ? 'Read Less' : 'Read More'}
                  </button>
                )}
              </div>
            </div>

            {/* Speakers Section */}
            {event.speakers && (() => {
              try {
                const parsedSpeakers = JSON.parse(event.speakers) as { name: string; role: string; image?: string | null }[];
                if (parsedSpeakers.length === 0) return null;
                return (
                  <div className="bg-[#18181c]/80 border border-white/10 rounded-2xl p-6 sm:p-7 flex flex-col gap-6 shadow-xl animate-fade-in">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <h3 className="font-instrument-serif text-xl sm:text-2xl text-white font-normal tracking-[-0.4px]">
                        Featured Speakers
                      </h3>
                      <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">{parsedSpeakers.length} Speaker{parsedSpeakers.length !== 1 ? 's' : ''}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-1">
                      {parsedSpeakers.map((sp, idx) => (
                        <div 
                          key={idx} 
                          className="group flex flex-col items-center text-center relative"
                        >
                          {/* Avatar */}
                          <div className="relative p-1 rounded-full bg-white/10 group-hover:bg-white/20 transition-all duration-300 shadow-xl">
                            {sp.image ? (
                              <img
                                src={sp.image}
                                alt={sp.name}
                                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#131316] border border-white/10 flex items-center justify-center text-xl sm:text-2xl font-bold text-white select-none">
                                {sp.name.substring(0, 1).toUpperCase()}
                              </div>
                            )}
                          </div>

                          {/* Speaker Name */}
                          <h4 className="text-sm font-semibold text-white tracking-tight mt-3 leading-snug">
                            {sp.name}
                          </h4>

                          {/* Speaker Role */}
                          <p className="text-[11px] text-white/50 font-mono mt-0.5 leading-relaxed max-w-[160px]">
                            {sp.role}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              } catch {
                return null;
              }
            })()}

          </div>

          {/* Right Side Column: Registration + Grab Pics & Videos + Meta Info */}
          <div className="lg:col-span-5 flex flex-col gap-5 sticky top-24">

            {/* Registration Card Console */}
            <div className="bg-[#18181c]/90 border border-white/10 rounded-2xl p-6 flex flex-col gap-5 shadow-2xl relative overflow-hidden backdrop-blur-xl">
              {/* Subtle top specular accent */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-white/40">Admission Price</span>
                  <div className="flex items-baseline gap-2">
                    {(event.price === '199' || event.price === '₹199' || (event.title && event.title.toLowerCase().includes('incept'))) && (
                      <span className="text-base sm:text-lg text-white/40 line-through font-mono">₹249</span>
                    )}
                    <span className="font-instrument-serif text-3xl sm:text-4xl text-white font-normal leading-none">
                      {event.price?.startsWith('₹') ? event.price : (event.price === 'Free' || !event.price ? 'Free' : `₹${event.price}`)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider bg-white/5 border border-white/10 text-white/70 px-2.5 py-1 rounded-md">
                    {event.visibility || 'Public'}
                  </span>
                  {isLimited && (
                    <span className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md border ${
                      isFull 
                        ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
                        : 'bg-white/5 border-white/10 text-white/70'
                    }`}>
                      {isFull ? '0 tickets left' : `${displayTicketsLeft} tickets left`}
                    </span>
                  )}
                </div>
              </div>

              {/* Dotted separator */}
              <div className="w-full border-t border-dashed border-white/10" />

              <div className="flex flex-col gap-3">
                {isEventCompleted(event) ? (
                  <div className="flex flex-col gap-2">
                    <div className="w-full py-3.5 bg-white/5 border border-white/10 text-white/40 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed select-none shadow-inner">
                      <GoClock className="w-4 h-4 text-white/40" />
                      <span>Event Concluded · Registration Closed</span>
                    </div>
                    <p className="text-[11px] text-white/40 text-center leading-relaxed">
                      This event has already taken place. Registration is closed for completed events.
                    </p>
                  </div>
                ) : registered ? (
                  <div className="flex flex-col gap-2">
                    <div className="w-full py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-xl flex items-center justify-center gap-2">
                      <GoCheck className="w-4 h-4 text-emerald-400" />
                      <span>You&apos;re Registered</span>
                    </div>
                    <a
                      href={`/events/${event.id}/register`}
                      className="w-full py-3 bg-white hover:bg-neutral-100 text-[#101010] text-xs font-bold rounded-xl text-center shadow-md active:scale-[0.99] transition-all cursor-pointer block"
                    >
                      View Ticket Pass
                    </a>
                  </div>
                ) : isFull ? (
                  <button
                    onClick={() => {
                      if (!user) {
                        router.push('/auth');
                      } else {
                        router.push(`/events/${event.id}/register?waitlist=true`);
                      }
                    }}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:brightness-110 text-white text-xs font-bold rounded-xl shadow-lg shadow-amber-500/20 active:scale-[0.99] transition-all cursor-pointer"
                  >
                    {user ? 'Join Waitlist' : 'Sign Up to Join Waitlist'}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (!user) {
                        router.push('/auth');
                      } else {
                        router.push(`/events/${event.id}/register`);
                      }
                    }}
                    className="w-full py-3.5 bg-white hover:bg-neutral-100 text-[#101010] text-xs font-bold rounded-xl shadow-lg active:scale-[0.99] transition-all cursor-pointer"
                  >
                    {user ? 'Register for Event' : 'Sign Up to Register'}
                  </button>
                )}

                {!registered && !isEventCompleted(event) && (
                  <p className="text-[11px] text-white/40 text-center leading-relaxed">
                    {isFull
                      ? `Capacity reached (${registrationsCount}/${maxCapacity} seats filled). Join waitlist to claim spots if tickets free up.`
                      : event.requireApproval
                        ? 'Requires host approval after registration.'
                        : 'Instant registration · No approval needed.'}
                  </p>
                )}
              </div>
            </div>

            {/* Grab Pics & Videos Container Card (ONLY for Student Forge Launch) */}
            {isStudentForgeLaunch && (
              <div className="bg-[#18181c]/80 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 shadow-xl relative overflow-hidden">
                <h3 className="font-instrument-serif text-lg text-white font-normal tracking-tight">
                  Grab Pics &amp; Videos from Here
                </h3>

                <div className="flex flex-col gap-3">
                  {/* Photos Button */}
                  <a
                    href="https://drive.google.com/drive/folders/1LdhVFoQzA6jnRYVbVB4ySX0QMugT8RF0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-white transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
                        <GoogleDriveLogo className="w-4.5 h-4.5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-white tracking-wide">Event Photos</span>
                        <span className="text-[10px] text-white/40 font-mono">Google Drive Folder</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-white/40 group-hover:text-white font-mono flex-shrink-0 ml-2">
                      <span className="text-[10px] hidden sm:inline opacity-75">View Photos</span>
                      <GoArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                  </a>

                  {/* Videos Button */}
                  <a
                    href="https://drive.google.com/drive/folders/1gFOufUzi2rcsWjvtN1xkBciV-f8KeM9N"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-white transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
                        <GoogleDriveLogo className="w-4.5 h-4.5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-white tracking-wide">Event Videos</span>
                        <span className="text-[10px] text-white/40 font-mono">Google Drive Folder</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-white/40 group-hover:text-white font-mono flex-shrink-0 ml-2">
                      <span className="text-[10px] hidden sm:inline opacity-75">View Videos</span>
                      <GoArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                  </a>
                </div>
              </div>
            )}

            {/* Event Meta Info Card */}
            <div className="bg-[#18181c]/80 border border-white/10 rounded-2xl p-6 flex flex-col gap-5 shadow-xl">

              {/* Date & Time row */}
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-white/70">
                  <GoCalendar className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-white/40">Date &amp; Time</span>
                  <span className="text-xs sm:text-sm font-semibold text-white mt-0.5 leading-snug">{event.startDate}</span>
                  <span className="text-[11px] text-white/50 font-mono mt-0.5">
                    {event.startTime}{event.endTime ? ` → ${event.endTime}` : ''}
                  </span>
                </div>
              </div>

              {/* Location row */}
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-white/70">
                  <GoLocation className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase font-mono tracking-widest text-white/40">Location</span>
                    {event.location && (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-white/60 hover:text-white flex items-center gap-0.5 transition-colors"
                      >
                        <span>Maps</span>
                        <GoArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <span className="text-xs text-white/80 font-normal mt-0.5 leading-relaxed break-words">{event.location || 'Online / Virtual'}</span>
                </div>
              </div>

              {/* Organizer row */}
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-white/70">
                  <GoPerson className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-white/40">Organizer</span>
                  <span className="text-xs font-semibold text-white mt-0.5 truncate">{event.organizer || 'Student Forge'}</span>
                </div>
              </div>

              {/* Capacity row */}
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-white/70">
                  <GoPeople className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-white/40">Capacity &amp; Availability</span>
                  <span className="text-xs font-semibold text-white mt-0.5">
                    {event.capacity || 'Unlimited'} seats
                    {isLimited && (
                      <span className={`ml-2 font-mono text-[11px] ${isFull ? 'text-rose-400 font-semibold' : 'text-white/50'}`}>
                        ({isFull ? '0 tickets left' : `${displayTicketsLeft} tickets left`})
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] text-white/40 mt-0.5">
                    {isFull
                      ? `${registrationsCount}/${maxCapacity} seats filled · Waitlist open`
                      : event.requireApproval
                        ? 'Requires host approval'
                        : 'Instant enrollment'}
                  </span>
                </div>
              </div>

            </div>

            {/* Standalone Official Event Partners Card (ONLY for Incept Edition 01) */}
            {isIncept01PartnersEvent && (
              <div className="w-full bg-[#18181c]/80 border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Official Event Partners</h4>
                  </div>
                  <span className="text-[10px] font-mono text-white/60 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">Collaborators</span>
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
                    {/* Yem nest */}
                    <div className="w-full h-14 bg-white/95 border border-white rounded-xl shadow-md p-2 flex items-center justify-center transition-transform hover:scale-[1.01]">
                      <img
                        src="https://ik.imagekit.io/dypkhqxip/yemnestnavbar.webp"
                        alt="Yem nest Marketplace Partner"
                        className="h-9 w-auto max-w-[110px] object-contain transform-gpu"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                    </div>

                    {/* Fitbasics */}
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

      </div>

      <Footer />
    </main>
  );
}
