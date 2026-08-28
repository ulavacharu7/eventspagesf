'use client';

import React, { useEffect, useState } from 'react';
import { GoLocation, GoCalendar, GoPlus, GoArrowRight, GoSearch } from 'react-icons/go';
import { EventData } from '@/lib/eventsStore';
import { isEventCompleted } from '@/lib/utils';
import { VerifiedBadge } from '@/components/VerifiedBadge';

const themes = [
  { name: 'Minimal', bg: 'bg-[#f4f4f5]', textColor: 'text-black', subText: '*HOW LUCKY YOU ARE' },
  { name: 'Quantum', bg: 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600', textColor: 'text-white', subText: '*BUILD THE UNKNOWN' },
  { name: 'Warp', bg: 'bg-black border border-[#2e2e34]', textColor: 'text-white', subText: '*JOIN THE FUTURE' },
  { name: 'Emoji', bg: 'bg-[#b497cf]', textColor: 'text-white', subText: '*STUDENT FORGE EVENTS' },
  { name: 'Confetti', bg: 'bg-gradient-to-tr from-purple-600 to-pink-500', textColor: 'text-white', subText: '*PARTY TIME' },
  { name: 'Pattern', bg: 'bg-gradient-to-tr from-indigo-600 to-teal-600', textColor: 'text-white', subText: '*PATTERN CREATION' },
  { name: 'Seasonal', bg: 'bg-gradient-to-tr from-rose-500 to-amber-500', textColor: 'text-white', subText: '*CREATORS GATHERING' },
  { name: 'PixelBlast', bg: 'bg-[#141416]', textColor: 'text-[#B497CF]', subText: '*PIXELBLAST INTERACTIVE' },
  { name: 'Grainient', bg: 'bg-gradient-to-tr from-[#FF9FFC] via-[#5227FF] to-[#B497CF]', textColor: 'text-white', subText: '*GRAINIENT ANIMATED' }
];

const EventImage: React.FC<{ event: EventData }> = ({ event }) => {
  const [error, setError] = useState(false);

  const getFirstImage = () => {
    if (event.coverImage) {
      const trimmed = event.coverImage.trim();
      if (trimmed.startsWith('data:')) {
        return trimmed;
      }
      const first = trimmed.split(',')[0].trim();
      if (first) return first;
    }
    const titleLower = (event.title || '').toLowerCase();
    if (event.id === 'cmsbpnls8000004lfw3buf1a7' || titleLower.includes('student forge') || titleLower.includes('platform launch')) {
      return 'https://ik.imagekit.io/dypkhqxip/mainbannersf';
    }
    return null;
  };

  const coverSrc = getFirstImage();

  if (coverSrc && !error) {
    return (
      <img
        src={coverSrc}
        alt={event.title}
        onError={() => setError(true)}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
    );
  }

  const activeTheme = event.themeIdx !== undefined && themes[event.themeIdx]
    ? themes[event.themeIdx]
    : themes[0];

  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col justify-between p-4 bg-neutral-900 border border-white/10 rounded-[12px]">
      <div className={`absolute inset-0 z-0 ${activeTheme.bg}`} />
      <div className={`z-10 flex flex-col gap-1.5 ${activeTheme.textColor || 'text-white'}`}>
        <h5 className="text-sm font-semibold font-tight leading-snug tracking-tight line-clamp-3">
          {event.title}
        </h5>
      </div>
      <div className={`z-10 flex flex-col text-xs font-mono tracking-wider opacity-90 border-t border-black/10 dark:border-white/20 pt-2 ${activeTheme.textColor || 'text-white'}`}>
        <span>{event.startDate}</span>
      </div>
    </div>
  );
};

const EventsList: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/events')
      .then((r) => r.json())
      .then((data) => {
        setEvents(data.events || []);
        setIsLoaded(true);
      })
      .catch(() => setIsLoaded(true));
  }, []);

  const upcomingCount = events.filter((e) => !isEventCompleted(e)).length;
  const pastCount = events.filter((e) => isEventCompleted(e)).length;

  const tabFilteredEvents = events.filter((e) => {
    if (activeTab === 'upcoming') {
      return !isEventCompleted(e);
    }
    return isEventCompleted(e);
  });

  const filteredEvents = tabFilteredEvents.filter((e) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      e.title?.toLowerCase().includes(q) ||
      e.location?.toLowerCase().includes(q) ||
      e.organizer?.toLowerCase().includes(q) ||
      e.ticketCode?.toLowerCase().includes(q)
    );
  });

  return (
    <section className="w-full py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#131313] text-white select-none">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-white/10">
          <div className="flex flex-col gap-1">
            <h2 className="font-instrument-serif text-2xl sm:text-3xl lg:text-4xl font-normal tracking-[-0.6px] text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d946ef] via-[#f97316] to-[#fbbf24]">
                Upcoming
              </span>{" "}
              Events
            </h2>
            <p className="font-tight text-xs sm:text-sm text-white/50 font-normal leading-relaxed max-w-lg">
              Discover summits, hackathons, workshops, and tech gatherings hosted across student chapters.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Filter Tabs (Upcoming first, Past second) */}
            <div className="flex items-center gap-1 bg-[#18181c] border border-white/10 rounded-[10px] p-1 flex-shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('upcoming')}
                className={`px-3.5 py-1.5 rounded-[7px] text-xs font-tight font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'upcoming'
                    ? 'bg-white text-[#101010] shadow-sm font-semibold'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>Upcoming Events</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${activeTab === 'upcoming' ? 'bg-neutral-900/10 text-neutral-900 font-bold' : 'bg-white/10 text-white/50'}`}>
                  {upcomingCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('past')}
                className={`px-3.5 py-1.5 rounded-[7px] text-xs font-tight font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'past'
                    ? 'bg-white text-[#101010] shadow-sm font-semibold'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>Past Events</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${activeTab === 'past' ? 'bg-neutral-900/10 text-neutral-900 font-bold' : 'bg-white/10 text-white/50'}`}>
                  {pastCount}
                </span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <GoSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events or city..."
                className="w-full bg-[#18181c]/80 border border-white/10 focus:border-white/30 text-white placeholder-white/40 text-xs sm:text-sm rounded-[10px] pl-10 pr-4 py-2 outline-none transition-all font-tight shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Loading Skeleton */}
        {!isLoaded ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-[#18181c]/60 border border-white/10 rounded-[18px] p-4 flex flex-col gap-3.5 animate-pulse select-none"
              >
                {/* 1200x1200 Aspect-Square Skeleton Image Frame */}
                <div className="w-full aspect-square bg-white/5 border border-white/10 rounded-[14px]" />

                <div className="flex flex-col gap-2">
                  <div className="h-3.5 bg-white/5 rounded w-1/3" />
                  <div className="h-5 bg-white/5 rounded w-4/5" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-1">
                  <div className="w-16 h-4 bg-white/5 rounded" />
                  <div className="w-20 h-7 bg-white/5 rounded-[8px]" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          /* Empty State */
          <div className="bg-[#18181c]/50 border border-white/10 rounded-[18px] p-12 sm:p-16 text-center flex flex-col items-center justify-center gap-4 shadow-xl backdrop-blur-xl">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-white/50 flex items-center justify-center">
              <GoCalendar className="w-7 h-7" />
            </div>

            <div className="flex flex-col gap-1 max-w-sm">
              <h3 className="font-instrument-serif text-2xl text-white font-normal tracking-[-0.4px]">
                {activeTab === 'upcoming' ? 'No Upcoming Events' : 'No Past Events'}
              </h3>
              <p className="font-tight text-xs text-white/50 leading-relaxed font-normal">
                {searchQuery
                  ? `No events match "${searchQuery}". Try a different keyword!`
                  : activeTab === 'upcoming'
                    ? 'There are no upcoming events scheduled at this moment. Host the first one!'
                    : 'There are no past events recorded yet.'}
              </p>
            </div>

            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 border border-white/15 hover:bg-white/20 text-white text-xs font-tight font-medium rounded-[8px] transition-all cursor-pointer shadow-sm"
              >
                <span>Clear Search</span>
              </button>
            ) : (
              <a
                href="/create-event"
                className="mt-2 relative inline-flex h-9 w-fit shrink-0 items-center justify-center rounded-[8px] border border-solid border-white/20 bg-white px-4 font-tight text-xs font-medium text-[#101010] shadow-[0px_2px_6px_rgba(0,0,0,0.22)] transition-all hover:opacity-90 active:scale-[0.97] cursor-pointer"
              >
                <GoPlus className="w-3.5 h-3.5 mr-1" />
                <span>Host an Event</span>
              </a>
            )}
          </div>
        ) : (
          /* Real Published Events Grid (1200x1200 Square Poster Frame) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const ended = isEventCompleted(event);
              return (
                <div
                  key={event.id}
                  onClick={() => window.location.href = `/events/${event.id}`}
                  className="group bg-[#18181c]/70 hover:bg-[#1f1f25] border border-white/10 hover:border-white/25 rounded-[18px] p-4 flex flex-col transition-all duration-200 cursor-pointer shadow-md hover:shadow-2xl hover:translate-y-[-3px]"
                >
                  {/* Top: 1200x1200 1:1 Aspect-Square Poster Container */}
                  <div className="relative w-full aspect-square bg-[#131316] border border-white/10 group-hover:border-white/20 rounded-[14px] overflow-hidden select-none flex-shrink-0 mb-3.5 shadow-sm">
                    <EventImage event={event} />
                  </div>

                  {/* Body: Event Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex flex-col gap-1.5 min-w-0">
                      {/* Date & Location Row */}
                      <div className="flex items-center justify-between text-xs text-white/50 font-tight">
                        <span className="flex items-center gap-1.5 text-white/70">
                          <GoCalendar className="w-3.5 h-3.5 text-white/40" />
                          {event.startDate}
                        </span>
                        <span className="truncate max-w-[130px] text-right font-normal">
                          {event.location?.split(',')[0] || 'Online'}
                        </span>
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-semibold font-tight text-white group-hover:text-white transition-colors line-clamp-2 leading-snug tracking-[-0.3px] mt-0.5">
                        {event.title}
                      </h3>

                      {/* Organizer */}
                      <span className="text-xs text-white/50 font-tight truncate flex items-center gap-1">
                        <span>By {event.organizer || 'Student Forge'}</span>
                        <VerifiedBadge className="w-3 h-3" />
                      </span>
                    </div>

                    {/* Footer: Price & Details Action */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[10px] uppercase font-mono text-white/40 tracking-wider">Price:</span>
                        {(event.price === '199' || event.price === '₹199' || (event.title && event.title.toLowerCase().includes('incept'))) && (
                          <span className="text-xs text-white/40 line-through font-mono">₹249</span>
                        )}
                        <span className="text-sm font-semibold font-tight text-white">
                          {event.price?.startsWith('₹') ? event.price : (event.price === 'Free' || !event.price ? 'Free' : `₹${event.price}`)}
                        </span>
                      </div>

                      <div className="inline-flex items-center gap-1.5 rounded-[8px] border border-solid border-white/15 bg-white/5 px-3 py-1.5 font-tight text-xs font-medium text-white/80 group-hover:bg-white group-hover:text-[#101010] group-hover:border-white transition-all shadow-sm">
                        <span>Details</span>
                        <GoArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};

export default EventsList;
