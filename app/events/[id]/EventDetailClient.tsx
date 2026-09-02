'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { EventData } from '@/lib/eventsStore';
import {
  GoCalendar,
  GoLocation,
  GoArrowLeft,
  GoCheck,
  GoArrowUpRight,
  GoClock,
  GoShareAndroid,
  GoCopy,
  GoChevronRight,
  GoTag,
} from 'react-icons/go';
import { useViewerCount } from '@/lib/useViewerCount';
import { DotmSquare5 } from '@/components/ui/dotm-square-5';
import { isEventCompleted } from '@/lib/utils';
import { VerifiedBadge } from '@/components/VerifiedBadge';

const GoogleCalendarLogo = ({ className = "w-4 h-4" }: { className?: string }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="4" width="18" height="17" rx="3" fill="#FFFFFF"/>
        <path d="M18 4H6C4.34315 4 3 5.34315 3 7V8H21V7C21 5.34315 19.6569 4 18 4Z" fill="#1A73E8"/>
        <path d="M7 2V5" stroke="#1A73E8" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M17 2V5" stroke="#1A73E8" strokeWidth="1.5" strokeLinecap="round"/>
        <rect x="6" y="11" width="3.2" height="3.2" rx="0.5" fill="#4285F4"/>
        <rect x="10.4" y="11" width="3.2" height="3.2" rx="0.5" fill="#EA4335"/>
        <rect x="14.8" y="11" width="3.2" height="3.2" rx="0.5" fill="#FBBC05"/>
        <rect x="6" y="15.5" width="3.2" height="3.2" rx="0.5" fill="#34A853"/>
        <rect x="10.4" y="15.5" width="3.2" height="3.2" rx="0.5" fill="#4285F4"/>
        <rect x="14.8" y="15.5" width="3.2" height="3.2" rx="0.5" fill="#EA4335"/>
      </svg>
    );
  }

  return (
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg"
      alt="Google Calendar"
      width={18}
      height={18}
      className={`${className} object-contain shrink-0`}
      onError={() => setHasError(true)}
    />
  );
};

const GoogleDriveLogo = ({ className = "w-4 h-4" }: { className?: string }) => {
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
      width={18}
      height={18}
      className={`${className} object-contain`}
      onError={() => setHasError(true)}
    />
  );
};

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
    return actual;
  };

  const displayTicketsLeft = getDisplayRemaining(actualRemaining);

  const isStudentForgeLaunch =
    event?.id === 'cmsbpnls8000004lfw3buf1a7' ||
    (event?.title && (
      event.title.toLowerCase().includes('student forge') ||
      event.title.toLowerCase().includes('platform launch')
    ));

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

  // 10-Second Delay Trigger + 3-Minute (180s) Flash Offer (₹20 OFF)
  const [showOffer, setShowOffer] = useState(false);
  const [offerSecondsLeft, setOfferSecondsLeft] = useState(180);

  useEffect(() => {
    if (!event || registered || eventEnded) return;

    // Check if event is paid
    const priceStr = (event.price || '').toLowerCase().trim();
    const isFree = !priceStr || priceStr.includes('free') || priceStr === '0' || priceStr === '₹0';
    if (isFree) return;

    const storageKey = `sf_flash_offer_${eventId}`;
    const dismissedKey = `sf_flash_offer_dismissed_${eventId}`;

    if (typeof window !== 'undefined' && sessionStorage.getItem(dismissedKey)) {
      return;
    }

    let existingExpiresAt: number | null = null;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.expiresAt && parsed.expiresAt > Date.now()) {
          existingExpiresAt = parsed.expiresAt;
        }
      }
    } catch {}

    let timerId: any = null;
    let countdownInterval: any = null;

    if (existingExpiresAt) {
      const diffSecs = Math.max(0, Math.floor((existingExpiresAt - Date.now()) / 1000));
      if (diffSecs > 0) {
        setOfferSecondsLeft(diffSecs);
        setShowOffer(true);
        countdownInterval = setInterval(() => {
          const nowDiff = Math.max(0, Math.floor((existingExpiresAt! - Date.now()) / 1000));
          setOfferSecondsLeft(nowDiff);
          if (nowDiff <= 0) {
            setShowOffer(false);
            clearInterval(countdownInterval);
          }
        }, 1000);
      }
    } else {
      // 10 seconds delay trigger
      timerId = setTimeout(() => {
        const expiresAt = Date.now() + 180 * 1000; // 3 minutes
        try {
          localStorage.setItem(
            storageKey,
            JSON.stringify({ active: true, expiresAt, discount: 20, code: 'FLASH20' })
          );
        } catch {}

        setOfferSecondsLeft(180);
        setShowOffer(true);

        countdownInterval = setInterval(() => {
          const nowDiff = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
          setOfferSecondsLeft(nowDiff);
          if (nowDiff <= 0) {
            setShowOffer(false);
            clearInterval(countdownInterval);
          }
        }, 1000);
      }, 10000); // 10s
    }

    return () => {
      if (timerId) clearTimeout(timerId);
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [event, eventId, registered, eventEnded]);

  const handleDismissOffer = () => {
    setShowOffer(false);
    try {
      sessionStorage.setItem(`sf_flash_offer_dismissed_${eventId}`, 'true');
    } catch {}
  };

  const handleClaimOffer = () => {
    const storageKey = `sf_flash_offer_${eventId}`;
    const expiresAt = Date.now() + Math.max(offerSecondsLeft, 60) * 1000;
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ active: true, expiresAt, discount: 20, code: 'FLASH20' })
      );
    } catch {}
    router.push(`/events/${eventId}/register?coupon=FLASH20`);
  };

  const formatOfferTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#111113] text-neutral-100 flex flex-col justify-between antialiased font-tight">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-24 px-4">
          <DotmSquare5 size={32} dotSize={3.5} speed={1.2} bloom colorPreset="grad-aurora" animated />
          <p className="text-xs text-neutral-400 font-mono tracking-wider uppercase">Loading...</p>
        </div>
        <Footer />
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-[#111113] text-neutral-100 flex flex-col justify-between antialiased font-tight">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-5 py-24 px-4">
          <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
            <GoCalendar className="w-6 h-6 text-neutral-400" />
          </div>
          <div className="text-center">
            <h2 className="font-instrument-serif text-2xl text-white">Event Not Found</h2>
            <p className="text-xs text-neutral-400 font-tight mt-1 max-w-sm">
              This event may have been removed or the link is invalid.
            </p>
          </div>
          <a
            href="/events"
            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-950 font-medium rounded-xl text-xs hover:bg-white transition-all shadow-sm active:scale-95 cursor-pointer font-tight"
          >
            <GoArrowLeft className="w-3.5 h-3.5" />
            <span>Browse Events</span>
          </a>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#111113] text-neutral-100 flex flex-col justify-between antialiased font-tight selection:bg-neutral-800 selection:text-white">
      <Navbar />

      <div className="w-full max-w-5xl mx-auto pt-16 sm:pt-20 md:pt-24 pb-20 px-4 sm:px-6 flex-1 flex flex-col gap-8 sm:gap-10">

        {/* Minimal Breadcrumb Navigation & Top Actions */}
        <div className="flex items-center justify-between gap-4">
          <nav className="flex items-center gap-2 text-xs text-neutral-400 font-tight">
            <a href="/" className="hover:text-neutral-200 transition-colors">Home</a>
            <span className="text-neutral-600">/</span>
            <a href="/events" className="hover:text-neutral-200 transition-colors">Events</a>
            <span className="text-neutral-600">/</span>
            <span className="text-neutral-200 font-medium truncate max-w-[160px] sm:max-w-xs">{event.title}</span>
          </nav>

          <div className="flex items-center gap-2 font-tight">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
            >
              <GoShareAndroid className="w-3.5 h-3.5 text-neutral-400" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
            >
              <GoCopy className="w-3.5 h-3.5 text-neutral-400" />
              <span>{copiedToast ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Luma-style Split Hero Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Left Column: Clean Event Poster */}
          <div className="md:col-span-6 flex flex-col gap-3.5">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl">
              {event.coverImage ? (
                <img
                  src={event.coverImage}
                  alt={event.title}
                  width={1200}
                  height={1200}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full flex flex-col justify-between p-8 bg-neutral-900 text-white font-tight">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs uppercase tracking-wider text-neutral-400 font-mono">
                      {event.calendarType || 'Gathering'}
                    </span>
                    <h2 className="font-instrument-serif text-2xl sm:text-3xl font-normal leading-tight">
                      {event.title}
                    </h2>
                  </div>
                  <div className="flex flex-col gap-0.5 pt-4 border-t border-neutral-800 text-xs text-neutral-400 font-mono">
                    <span>{event.startDate} · {event.startTime}</span>
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Google Calendar Quick Link */}
            <a
              href={buildGoogleCalendarUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800/80 hover:border-neutral-700 text-neutral-300 hover:text-white text-xs font-medium transition-colors flex items-center justify-center gap-2.5 cursor-pointer font-tight shadow-sm"
            >
              <GoogleCalendarLogo className="w-4 h-4" />
              <span>Add to Google Calendar</span>
            </a>
          </div>

          {/* Right Column: Title, Host, Date/Location List, and Registration Box */}
          <div className="md:col-span-6 flex flex-col gap-6">

            {/* Event Title & Host */}
            <div className="flex flex-col gap-3">
              <h1 className="font-instrument-serif text-3xl sm:text-4xl lg:text-[44px] font-normal tracking-[-0.6px] text-white leading-[1.1]">
                {event.title}
              </h1>

              {/* Host Row */}
              <div className="flex items-center gap-2.5 pt-0.5">
                <div className="w-7 h-7 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-semibold text-neutral-300 shrink-0 font-mono">
                  {(event.organizer || 'Student Forge').charAt(0)}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-tight">
                  <span>Presented by</span>
                  <span className="font-semibold text-neutral-200">{event.organizer || 'Student Forge'}</span>
                  <VerifiedBadge className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Luma-style Info List (Date & Venue) */}
            <div className="flex flex-col gap-4 py-2 border-y border-neutral-800/80">
              
              {/* Date Row */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 shrink-0 mt-0.5">
                  <GoCalendar className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0 font-tight">
                  <span className="text-sm font-semibold text-white tracking-tight leading-snug">
                    {event.startDate}
                  </span>
                  <span className="text-xs text-neutral-400 font-mono mt-0.5">
                    {event.startTime}{event.endTime ? ` – ${event.endTime}` : ''}
                  </span>
                </div>
              </div>

              {/* Location Row */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 shrink-0 mt-0.5">
                  <GoLocation className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0 flex-1 font-tight">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white tracking-tight leading-snug truncate">
                      {event.location ? event.location.split(',')[0] : 'Online / Virtual'}
                    </span>
                    {event.location && (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-neutral-400 hover:text-white flex items-center gap-0.5 transition-colors cursor-pointer ml-2 shrink-0 font-tight"
                      >
                        <span>Maps</span>
                        <GoArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="text-xs text-neutral-400 hover:text-neutral-200 text-left whitespace-normal break-words leading-relaxed transition-colors mt-1 cursor-pointer font-tight block"
                    title="Click to copy full address"
                  >
                    {copiedAddressToast ? '✓ Address Copied to Clipboard!' : (event.location || 'Virtual event')}
                  </button>
                </div>
              </div>

            </div>

            {/* Clean Registration Box */}
            <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex flex-col gap-4 shadow-xl">
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] uppercase tracking-wider font-mono text-neutral-400">
                    Registration
                  </span>
                  <div className="flex items-baseline gap-2">
                    {(event.price === '199' || event.price === '₹199' || isInceptEvent) && (
                      <span className="text-sm text-neutral-500 line-through font-mono">
                        ₹249
                      </span>
                    )}
                    <span className="font-instrument-serif text-3xl sm:text-4xl font-normal text-white leading-none">
                      {event.price?.startsWith('₹') ? event.price : (event.price === 'Free' || !event.price ? 'Free' : `₹${event.price}`)}
                    </span>
                  </div>
                </div>

                {isLimited && (
                  <span className="text-xs font-mono text-neutral-400 bg-neutral-800/80 border border-neutral-700/80 px-2.5 py-1 rounded-md">
                    {isFull ? 'Sold Out' : `${displayTicketsLeft} spots left`}
                  </span>
                )}
              </div>

              {/* Action Button */}
              <div className="flex flex-col gap-2.5 pt-1 font-tight">
                {eventEnded ? (
                  <div className="w-full py-3 bg-neutral-800 border border-neutral-700 text-neutral-400 text-xs font-medium rounded-xl text-center cursor-not-allowed font-tight">
                    Event Concluded · Registration Closed
                  </div>
                ) : registered ? (
                  <div className="flex flex-col gap-2 font-tight">
                    <div className="w-full py-2 bg-emerald-950/40 border border-emerald-800/60 text-emerald-400 text-xs font-medium rounded-xl flex items-center justify-center gap-1.5">
                      <GoCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>You are registered</span>
                    </div>
                    <a
                      href={`/events/${event.id}/register`}
                      className="w-full py-3 bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-semibold rounded-xl text-center transition-colors block cursor-pointer shadow-sm font-tight"
                    >
                      View Ticket Pass
                    </a>
                  </div>
                ) : isFull ? (
                  <div className="w-full py-3 bg-neutral-850 border border-neutral-750 text-neutral-400 text-xs font-semibold rounded-xl text-center cursor-not-allowed font-tight shadow-sm bg-neutral-900/90">
                    Registration Closed · All Seats Filled
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (!user) router.push('/auth');
                      else router.push(`/events/${event.id}/register`);
                    }}
                    className="w-full py-3 bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-1.5 font-tight"
                  >
                    <span>{user ? 'Register for Event' : 'Sign Up to Register'}</span>
                    <GoArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {!registered && !eventEnded && (
                  <p className="text-[11px] text-neutral-400 text-center leading-relaxed font-tight">
                    {event.requireApproval
                      ? 'Requires host approval after registration'
                      : 'Instant registration · QR pass generated upon RSVP'}
                  </p>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* Clean About & Details Section */}
        <div className="flex flex-col gap-8 pt-4 border-t border-neutral-800/80">

          {/* About Event Description */}
          <div className="flex flex-col gap-3 font-tight">
            <h3 className="font-instrument-serif text-2xl sm:text-3xl text-white font-normal tracking-[-0.4px]">
              About Event
            </h3>
            <div className="flex flex-col gap-2">
              <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap font-tight">
                {event.description
                  ? (isDescExpanded || event.description.length <= 400
                    ? event.description
                    : `${event.description.substring(0, 400)}...`)
                  : 'No detailed description provided for this event.'}
              </p>
              {event.description && event.description.length > 400 && (
                <button
                  type="button"
                  onClick={() => setIsDescExpanded(!isDescExpanded)}
                  className="text-xs font-semibold text-neutral-200 hover:text-white transition-colors text-left underline underline-offset-4 cursor-pointer mt-1 py-0.5 block outline-none font-tight"
                >
                  {isDescExpanded ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>

          </div>

          {/* Featured Speakers */}
          {parsedSpeakers.length > 0 && (
            <div className="flex flex-col gap-4 pt-4 border-t border-neutral-800/80 font-tight">
              <div className="flex items-center justify-between">
                <h3 className="font-instrument-serif text-2xl sm:text-3xl text-white font-normal tracking-[-0.4px]">
                  Featured Speakers
                </h3>
                <span className="text-xs font-mono text-neutral-400">
                  {parsedSpeakers.length} Speaker{parsedSpeakers.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {parsedSpeakers.map((sp, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col items-center text-center font-tight"
                  >
                    <div className="relative mb-3">
                      {sp.image ? (
                        <img
                          src={sp.image}
                          alt={sp.name}
                          className="w-16 h-16 rounded-full object-cover border border-neutral-700"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-lg font-bold text-white font-mono">
                          {sp.name.substring(0, 1).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <h4 className="text-xs font-semibold text-white tracking-tight">
                      {sp.name}
                    </h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-2">
                      {sp.role}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Event Media / Photos & Videos (for Student Forge Launch) */}
          {isStudentForgeLaunch && (
            <div className="flex flex-col gap-3 pt-4 border-t border-neutral-800/80 font-tight">
              <h3 className="font-instrument-serif text-2xl sm:text-3xl text-white font-normal tracking-[-0.4px]">
                Event Media
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="https://drive.google.com/drive/folders/1LdhVFoQzA6jnRYVbVB4ySX0QMugT8RF0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 transition-colors group cursor-pointer font-tight"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <GoogleDriveLogo className="w-5 h-5 shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-white">Event Photos</span>
                      <span className="text-[10px] text-neutral-400 font-mono">Google Drive Folder</span>
                    </div>
                  </div>
                  <GoArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-white" />
                </a>

                <a
                  href="https://drive.google.com/drive/folders/1gFOufUzi2rcsWjvtN1xkBciV-f8KeM9N"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 transition-colors group cursor-pointer font-tight"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <GoogleDriveLogo className="w-5 h-5 shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-white">Event Videos</span>
                      <span className="text-[10px] text-neutral-400 font-mono">Google Drive Folder</span>
                    </div>
                  </div>
                  <GoArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-white" />
                </a>
              </div>
            </div>
          )}

          {/* Official Partners (Incept Edition 01 only) */}
          {isIncept01PartnersEvent && (
            <div className="flex flex-col gap-3 pt-4 border-t border-neutral-800/80 font-tight">
              <h3 className="font-instrument-serif text-2xl sm:text-3xl text-white font-normal tracking-[-0.4px]">
                Official Event Partners
              </h3>

              <div className="flex flex-col gap-3 font-tight">
                <a
                  href="https://www.peopld.in/event/incept-edition-01-50ca84e6/register"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 p-3 bg-white rounded-xl text-neutral-900 transition-opacity hover:opacity-90 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src="https://ik.imagekit.io/dypkhqxip/peopld"
                      alt="Peopld"
                      className="h-8 w-auto object-contain"
                      onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-neutral-900">Peopld Pass Portal</span>
                      <span className="text-[10px] text-neutral-500 font-tight">Official Registration Partner</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-neutral-900 flex items-center gap-1">
                    <span>Get Pass</span>
                    <GoArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </a>

                <div className="grid grid-cols-2 gap-3">
                  <div className="h-12 bg-white rounded-xl p-2 flex items-center justify-center">
                    <img
                      src="https://ik.imagekit.io/dypkhqxip/yemnestnavbar.webp"
                      alt="Yem nest"
                      className="h-7 w-auto max-w-[100px] object-contain"
                      onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                    />
                  </div>
                  <div className="h-12 bg-neutral-900 border border-neutral-800 rounded-xl p-2 flex items-center justify-center">
                    <img
                      src="https://ik.imagekit.io/dypkhqxip/ven1"
                      alt="Fitbasics"
                      className="h-7 w-auto max-w-[100px] object-contain"
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
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 p-3 bg-[#111113]/95 backdrop-blur-xl border-t border-neutral-800 shadow-2xl font-tight">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-mono text-neutral-400">Price</span>
            <div className="flex items-baseline gap-1.5">
              {(event.price === '199' || event.price === '₹199' || isInceptEvent) && (
                <span className="text-xs text-neutral-500 line-through font-mono">₹249</span>
              )}
              <span className="text-base font-bold text-white font-tight">
                {event.price?.startsWith('₹') ? event.price : (event.price === 'Free' || !event.price ? 'Free' : `₹${event.price}`)}
              </span>
            </div>
          </div>

          <div className="flex-1 max-w-[180px]">
            {eventEnded ? (
              <div className="w-full py-2.5 bg-neutral-800 border border-neutral-700 text-neutral-400 text-xs font-medium rounded-xl text-center cursor-not-allowed">
                Concluded
              </div>
            ) : registered ? (
              <a
                href={`/events/${event.id}/register`}
                className="w-full py-2.5 bg-white text-neutral-950 text-xs font-semibold rounded-xl text-center block font-tight"
              >
                View Pass
              </a>
            ) : isFull ? (
              <div className="w-full py-2.5 bg-neutral-800 border border-neutral-700 text-neutral-400 text-xs font-semibold rounded-xl text-center cursor-not-allowed font-tight">
                Sold Out
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (!user) router.push('/auth');
                  else router.push(`/events/${event.id}/register`);
                }}
                className="w-full py-2.5 bg-white text-neutral-950 text-xs font-semibold rounded-xl text-center flex items-center justify-center gap-1 font-tight"
              >
                <span>Register</span>
                <GoChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 10-Second 3-Minute ₹20 Flash Offer Floating Card */}
      {showOffer && !registered && !eventEnded && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 max-w-[340px] sm:max-w-[360px] w-[calc(100%-2rem)] sm:w-auto animate-fade-in font-sans">
          <div className="relative overflow-hidden p-5 rounded-2xl bg-[#141417]/95 backdrop-blur-2xl border border-white/12 shadow-[0_20px_50px_rgba(0,0,0,0.7)] flex flex-col gap-4 text-white">
            
            {/* Ambient Top Glow */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-20 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Top Bar: Flash Pill + Timer Capsule + Close Button */}
            <div className="flex items-center justify-between gap-2 z-10">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-semibold tracking-wider uppercase">
                  Flash Discount
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-neutral-200 text-xs font-mono font-medium">
                  <GoClock className="w-3 h-3 text-neutral-400" />
                  <span>{formatOfferTimer(offerSecondsLeft)}</span>
                </div>

                <button
                  type="button"
                  onClick={handleDismissOffer}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close offer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Middle Content: Clean Headline & Discount Highlight */}
            <div className="flex flex-col gap-1.5 z-10">
              <div className="flex items-baseline justify-between">
                <h3 className="text-base font-semibold text-white tracking-tight">
                  Instant ₹20 Savings
                </h3>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-white/10 text-neutral-300 border border-white/10">
                  FLASH20
                </span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Save ₹20 on your event pass. Claim your code now before the timer expires.
              </p>
            </div>

            {/* Bottom Actions: Expansive Clean CTA */}
            <div className="flex flex-col gap-2 pt-0.5 z-10">
              <button
                type="button"
                onClick={handleClaimOffer}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-100 text-neutral-950 font-semibold text-xs transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer group"
              >
                <span>Claim Offer &amp; Book Pass</span>
                <GoChevronRight className="w-3.5 h-3.5 text-neutral-600 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={handleDismissOffer}
                className="text-[11px] text-neutral-500 hover:text-neutral-400 text-center transition-colors cursor-pointer py-0.5"
              >
                No thanks, continue with regular price
              </button>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
