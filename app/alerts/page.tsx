'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { GoBell, GoCheckCircle, GoClock, GoAlert, GoCalendar, GoShield, GoArrowRight, GoChevronRight } from 'react-icons/go';

interface NotificationItem {
  id: string;
  type: 'approved' | 'pending' | 'rejected' | 'new_event';
  title: string;
  message: string;
  date: string;
  link: string;
  organizer?: string;
  rawDate: string;
}

const colorThemes = [
  {
    name: 'lavender',
    card: 'bg-gradient-to-r from-[#231838]/60 via-[#18181c]/90 to-[#18181c]/70 border-[#8b5cf6]/25 hover:border-[#a78bfa]/50',
    iconBox: 'bg-[#8b5cf6]/15 border-[#8b5cf6]/30 text-[#c4b5fd]',
    badge: 'bg-[#8b5cf6]/15 border-[#8b5cf6]/30 text-[#ddd6fe]',
    dot: 'bg-[#a78bfa]',
  },
  {
    name: 'cyan',
    card: 'bg-gradient-to-r from-[#122838]/60 via-[#18181c]/90 to-[#18181c]/70 border-[#0ea5e9]/25 hover:border-[#38bdf8]/50',
    iconBox: 'bg-[#0ea5e9]/15 border-[#0ea5e9]/30 text-[#7dd3fc]',
    badge: 'bg-[#0ea5e9]/15 border-[#0ea5e9]/30 text-[#bae6fd]',
    dot: 'bg-[#38bdf8]',
  },
  {
    name: 'peach',
    card: 'bg-gradient-to-r from-[#301c14]/60 via-[#18181c]/90 to-[#18181c]/70 border-[#f97316]/25 hover:border-[#fb923c]/50',
    iconBox: 'bg-[#f97316]/15 border-[#f97316]/30 text-[#fdba74]',
    badge: 'bg-[#f97316]/15 border-[#f97316]/30 text-[#fed7aa]',
    dot: 'bg-[#fb923c]',
  },
  {
    name: 'sage',
    card: 'bg-gradient-to-r from-[#132c20]/60 via-[#18181c]/90 to-[#18181c]/70 border-[#10b981]/25 hover:border-[#34d399]/50',
    iconBox: 'bg-[#10b981]/15 border-[#10b981]/30 text-[#6ee7b7]',
    badge: 'bg-[#10b981]/15 border-[#10b981]/30 text-[#a7f3d0]',
    dot: 'bg-[#34d399]',
  },
  {
    name: 'rose',
    card: 'bg-gradient-to-r from-[#301622]/60 via-[#18181c]/90 to-[#18181c]/70 border-[#f43f5e]/25 hover:border-[#fb7185]/50',
    iconBox: 'bg-[#f43f5e]/15 border-[#f43f5e]/30 text-[#fda4af]',
    badge: 'bg-[#f43f5e]/15 border-[#f43f5e]/30 text-[#fecdd3]',
    dot: 'bg-[#fb7185]',
  }
];

export default function AlertsPage() {
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'registrations' | 'events'>('all');

  useEffect(() => {
    let currentUser: any = null;
    try {
      const stored = localStorage.getItem('student_forge_user');
      if (stored) {
        currentUser = JSON.parse(stored);
        setUser(currentUser);
      }
    } catch (e) {
      console.error(e);
    }

    const fetchAlerts = async () => {
      setLoading(true);
      const items: NotificationItem[] = [];

      try {
        const eventsRes = await fetch('/api/events');
        const eventsData = await eventsRes.json();
        const events = eventsData.events || [];

        events.forEach((ev: any) => {
          items.push({
            id: `ev-${ev.id}`,
            type: 'new_event',
            title: ev.title || 'New Campus Event',
            message: `Scheduled for ${ev.startDate}. RSVP is now open.`,
            date: ev.createdAt ? new Date(ev.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            }) : 'Recently',
            link: `/events/${ev.id}`,
            organizer: ev.organizer || 'Student Forge',
            rawDate: ev.createdAt || ev.startDate || ''
          });
        });

        if (currentUser && currentUser.email) {
          const regsRes = await fetch(`/api/registrations?email=${encodeURIComponent(currentUser.email)}`);
          const regsData = await regsRes.json();
          const registrations = regsData.registrations || [];

          registrations.forEach((reg: any) => {
            let type: 'approved' | 'pending' | 'rejected' = 'pending';
            let title = 'Registration Pending';
            let message = `Awaiting host approval for "${reg.eventTitle}".`;

            if (reg.status === 'APPROVED') {
              type = 'approved';
              title = 'Ticket Approved';
              message = `Pass generated for "${reg.eventTitle}". Ready for check-in.`;
            } else if (reg.status === 'REJECTED') {
              type = 'rejected';
              title = 'Registration Declined';
              message = `Registration not accepted for "${reg.eventTitle}".`;
            }

            items.push({
              id: `reg-${reg.id}`,
              type,
              title,
              message,
              date: reg.createdAt ? new Date(reg.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              }) : 'Recently',
              link: `/events/${reg.eventId}/register`,
              rawDate: reg.createdAt || ''
            });
          });
        }
      } catch (err) {
        console.error('Failed to load notifications:', err);
      }

      items.sort((a, b) => {
        const dateA = new Date(a.rawDate).getTime();
        const dateB = new Date(b.rawDate).getTime();
        return dateB - dateA;
      });

      setNotifications(items);
      setLoading(false);
    };

    fetchAlerts();
  }, []);

  const counts = {
    all: notifications.length,
    registrations: notifications.filter(i => i.type === 'approved' || i.type === 'pending' || i.type === 'rejected').length,
    events: notifications.filter(i => i.type === 'new_event').length,
  };

  const filteredNotifications = notifications.filter((item) => {
    if (activeFilter === 'registrations') {
      return item.type === 'approved' || item.type === 'pending' || item.type === 'rejected';
    }
    if (activeFilter === 'events') {
      return item.type === 'new_event';
    }
    return true;
  });

  const getTheme = (type: string, index: number) => {
    if (type === 'approved') return colorThemes[3]; // sage
    if (type === 'rejected') return colorThemes[4]; // rose
    if (type === 'pending') return colorThemes[2];  // peach
    // new_event rotates between themes
    return colorThemes[index % colorThemes.length];
  };

  const getIcon = (type: string, theme: typeof colorThemes[0]) => {
    switch (type) {
      case 'approved':
        return <GoCheckCircle className="w-5 h-5 text-[#6ee7b7]" />;
      case 'rejected':
        return <GoAlert className="w-5 h-5 text-[#fda4af]" />;
      case 'new_event':
        return <GoCalendar className="w-5 h-5" />;
      default:
        return <GoClock className="w-5 h-5 text-[#fdba74]" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Declined';
      case 'new_event':
        return 'New Event';
      default:
        return 'Pending';
    }
  };

  return (
    <main className="relative min-h-screen bg-[#131313] text-white flex flex-col justify-between antialiased font-tight select-none">
      <Navbar />

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 md:pt-20 pb-20 flex-1 flex flex-col gap-6 z-10 relative">
        
        {/* Page Top Header */}
        <div className="flex flex-col gap-2.5">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-[11px] font-mono text-white/40">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <GoChevronRight className="w-3 h-3 opacity-30" />
            <span className="text-white/80">Alerts</span>
          </nav>
          
          <div className="flex flex-col gap-1">
            <h1 className="font-instrument-serif text-2xl sm:text-3xl lg:text-4xl text-white font-normal tracking-[-0.6px] leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d946ef] via-[#f97316] to-[#fbbf24]">
                Notifications
              </span>{" "}
              & Alerts
            </h1>
            <p className="font-tight text-xs sm:text-sm text-white/50 font-normal leading-relaxed max-w-lg">
              Stay updated with ticket approvals, event launches, and announcements.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3.5 pt-1.5">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 rounded-[8px] text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 font-tight font-medium ${
                activeFilter === 'all'
                  ? 'bg-white text-[#101010] shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>All</span>
              <span className={`text-xs px-1.5 py-0.2 rounded-full font-mono ${activeFilter === 'all' ? 'bg-neutral-900/10 text-neutral-900 font-bold' : 'bg-white/10 text-white/50'}`}>
                {counts.all}
              </span>
            </button>
            
            <button
              type="button"
              onClick={() => setActiveFilter('registrations')}
              className={`px-3.5 py-1.5 rounded-[8px] text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 font-tight font-medium ${
                activeFilter === 'registrations'
                  ? 'bg-white text-[#101010] shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>Registrations</span>
              {counts.registrations > 0 && (
                <span className={`text-xs px-1.5 py-0.2 rounded-full font-mono ${activeFilter === 'registrations' ? 'bg-neutral-900/10 text-neutral-900 font-bold' : 'bg-white/10 text-white/50'}`}>
                  {counts.registrations}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('events')}
              className={`px-3.5 py-1.5 rounded-[8px] text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 font-tight font-medium ${
                activeFilter === 'events'
                  ? 'bg-white text-[#101010] shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>Events</span>
              <span className={`text-xs px-1.5 py-0.2 rounded-full font-mono ${activeFilter === 'events' ? 'bg-neutral-900/10 text-neutral-900 font-bold' : 'bg-white/10 text-white/50'}`}>
                {counts.events}
              </span>
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-h-[300px]">
          {loading ? (
            <div className="flex flex-col gap-3.5 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-full h-24 bg-[#18181c]/60 border border-white/10 rounded-[12px]" />
              ))}
            </div>
          ) : (
            <>
              {/* Sign in banner for guest users */}
              {!user && activeFilter === 'all' && (
                <div className="mb-5 bg-gradient-to-r from-[#231838]/50 via-[#18181c]/80 to-[#18181c]/60 border border-[#8b5cf6]/25 rounded-[12px] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm text-white/70 shadow-sm backdrop-blur-xl">
                  <div className="flex items-center gap-2.5">
                    <GoShield className="w-4 h-4 text-[#c4b5fd] flex-shrink-0" />
                    <span>Sign in to view real-time ticket approvals & QR passes.</span>
                  </div>
                  <a
                    href="/auth"
                    className="relative inline-flex h-8 w-fit shrink-0 items-center justify-center rounded-[8px] border border-solid border-white/20 bg-white px-3.5 font-tight text-xs font-medium text-[#101010] shadow-[0px_2px_4px_rgba(0,0,0,0.2)] transition-all hover:opacity-90 active:scale-[0.97] cursor-pointer"
                  >
                    <span>Sign In</span>
                  </a>
                </div>
              )}

              {!user && activeFilter === 'registrations' ? (
                /* Unauthenticated Prompt for Registrations */
                <div className="bg-[#18181c]/60 border border-white/10 rounded-[14px] p-10 sm:p-14 text-center flex flex-col items-center justify-center gap-3 shadow-xl backdrop-blur-xl">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-white/60 flex items-center justify-center">
                    <GoShield className="w-6 h-6 text-white/70" />
                  </div>

                  <div className="flex flex-col gap-1 max-w-sm">
                    <h3 className="font-instrument-serif text-2xl text-white font-normal tracking-[-0.4px]">Authentication Required</h3>
                    <p className="font-tight text-xs text-white/60 leading-relaxed font-normal">
                      Sign in to view your approved event passes and tickets.
                    </p>
                  </div>

                  <a
                    href="/auth"
                    className="mt-1 relative inline-flex h-9 w-fit shrink-0 items-center justify-center rounded-[8px] border border-solid border-white/20 bg-white px-4 font-tight text-xs font-medium text-[#101010] shadow-[0px_2px_6px_rgba(0,0,0,0.22)] transition-all hover:opacity-90 active:scale-[0.97] cursor-pointer"
                  >
                    <span>Sign In with Email</span>
                  </a>
                </div>
              ) : filteredNotifications.length === 0 ? (
                /* Empty Notifications State */
                <div className="bg-[#18181c]/60 border border-white/10 rounded-[14px] p-10 sm:p-14 text-center flex flex-col items-center justify-center gap-3 shadow-xl backdrop-blur-xl">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-white/50 flex items-center justify-center">
                    <GoBell className="w-6 h-6" />
                  </div>

                  <div className="flex flex-col gap-1 max-w-sm">
                    <h3 className="font-instrument-serif text-2xl text-white font-normal tracking-[-0.4px]">No Notifications</h3>
                    <p className="font-tight text-xs text-white/50 leading-relaxed font-normal">
                      There are no updates matching this category right now.
                    </p>
                  </div>
                </div>
              ) : (
                /* Notifications List with curated Soft Colors */
                <div className="flex flex-col gap-3">
                  {filteredNotifications.map((item, index) => {
                    const theme = getTheme(item.type, index);
                    return (
                      <div
                        key={item.id}
                        onClick={() => (window.location.href = item.link)}
                        className={`group border rounded-[12px] p-4 sm:p-4.5 flex items-center justify-between gap-4 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:translate-y-[-1px] ${theme.card}`}
                      >
                        {/* Left: Icon & Concise Content */}
                        <div className="flex items-center gap-3.5 flex-1 min-w-0">
                          <div className={`w-10 h-10 rounded-[9px] border flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform ${theme.iconBox}`}>
                            {getIcon(item.type, theme)}
                          </div>

                          <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-sm font-semibold font-tight text-white tracking-tight group-hover:text-white transition-colors truncate max-w-md">
                                {item.title}
                              </h3>
                              <span className={`inline-flex items-center gap-1.5 text-[11px] font-tight font-medium border px-2 py-0.5 rounded-[6px] ${theme.badge}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`}></span>
                                {getTypeLabel(item.type)}
                              </span>
                            </div>
                            
                            <p className="font-tight text-xs text-white/70 leading-relaxed truncate max-w-xl">
                              {item.message}
                            </p>

                            <div className="flex items-center gap-2 text-[11px] text-white/40 font-mono">
                              {item.organizer && (
                                <>
                                  <span>{item.organizer}</span>
                                  <span>•</span>
                                </>
                              )}
                              <span>{item.date}</span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Action Arrow */}
                        <div className="flex items-center flex-shrink-0">
                          <span className="inline-flex items-center gap-1.5 rounded-[6px] border border-white/10 bg-white/5 px-3 py-1.5 font-tight text-xs font-medium text-white/75 group-hover:border-white/40 group-hover:bg-white/10 group-hover:text-white transition-all">
                            <span>View</span>
                            <GoArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

      </div>

      <Footer />
    </main>
  );
}
