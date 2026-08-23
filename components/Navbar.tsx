'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GoBell, GoPerson, GoSignOut, GoArrowRight } from 'react-icons/go';
import { Menu, X } from 'lucide-react';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  profileImage?: string | null;
}

export default function Navbar() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  
  const profileRef = useRef<HTMLDivElement>(null);

  // Load user session from localStorage and check notifications
  useEffect(() => {
    try {
      const raw = localStorage.getItem('student_forge_user');
      if (raw) {
        const parsed = JSON.parse(raw);
        setUser(parsed);
        // Fetch latest profile photo from database to keep in sync
        if (parsed.email) {
          fetch(`/api/user/profile?email=${encodeURIComponent(parsed.email)}`)
            .then(res => res.json())
            .then(data => {
              if (data.success && data.profileImage) {
                const updated = { ...parsed, profileImage: data.profileImage };
                setUser(updated);
                localStorage.setItem('student_forge_user', JSON.stringify(updated));
              }
            })
            .catch(err => console.error('Navbar profile sync error:', err));
        }
      }
    } catch (e) {
      console.error('Error reading user session:', e);
    }
  }, []);

  // Notifications checking hook
  useEffect(() => {
    const checkNotifications = async () => {
      try {
        let count = 0;
        
        // Fetch events count
        const eventsRes = await fetch('/api/events');
        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          const events = eventsData.events || [];
          count += events.length;
        }

        // Fetch user registrations count if logged in
        const stored = localStorage.getItem('student_forge_user');
        if (stored) {
          const currentUser = JSON.parse(stored);
          if (currentUser?.email) {
            const regsRes = await fetch(`/api/registrations?email=${encodeURIComponent(currentUser.email)}`);
            if (regsRes.ok) {
              const regsData = await regsRes.json();
              const registrations = regsData.registrations || [];
              count += registrations.length;
            }
          }
        }

        setNotificationCount(count);
      } catch (err) {
        console.error('Error checking notifications in Navbar:', err);
      }
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('student_forge_user');
    setUser(null);
    setIsProfileOpen(false);
    window.location.href = '/';
  };

  // Simplified concise menu items
  const navLinks = [
    { label: 'Events', href: '/events' },
    { label: 'Explore', href: '/explore' },
    { label: 'Host Event', href: '/create-event' },
  ];

  return (
    <header className="sticky top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none font-sans pt-2">
      <div className="pointer-events-auto w-full max-w-[660px] relative flex flex-col items-center">
        
        {/* Compact Floating Glassmorphism Container */}
        <nav className="w-full rounded-[14px] bg-[#131313]/65 border border-white/12 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5),inset_0_1px_1px_0_rgba(255,255,255,0.12)] px-4 py-2 flex items-center justify-between transition-all duration-300">
          
          {/* Left: Brand Logo */}
          <a href="/" className="flex items-center gap-2 cursor-pointer select-none group" aria-label="Student Forge Home">
            <img
              src="https://ik.imagekit.io/dypkhqxip/sf-events-svg?updatedAt=1787505496001"
              alt="Student Forge Events"
              className="h-8 sm:h-9 w-auto object-contain transition-all duration-200 group-hover:scale-105 opacity-90 group-hover:opacity-100"
              style={{ filter: 'brightness(0) invert(0.88)' }}
              draggable={false}
            />
          </a>

          {/* Center: Simplified Navigation Links */}
          <div className="hidden sm:flex items-center gap-0.5 bg-white/[0.03] border border-white/8 rounded-[8px] px-1.5 py-1 backdrop-blur-md">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="inline-flex items-center px-3 py-1 rounded-[6px] font-tight text-[13px] font-medium tracking-[-0.26px] text-white/75 hover:text-white hover:bg-white/8 transition-all duration-150"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            
            {/* Bell Notification Icon (Hero button secondary style with numeric badge) */}
            <a
              href="/alerts"
              className="relative inline-flex h-8 w-8 shrink-0 touch-manipulation items-center justify-center rounded-[8px] border border-solid border-white/20 bg-transparent text-white transition-[opacity,transform,border-color,background-color] duration-200 ease hover:border-white/60 hover:bg-white/5 active:scale-[0.97] cursor-pointer"
              aria-label="Notifications"
            >
              <GoBell className="w-3.5 h-3.5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[15px] h-[15px] px-0.5 text-[9px] font-bold font-mono text-white bg-rose-500 rounded-full border border-[#131313] shadow-sm">
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              )}
            </a>

            {/* Profile Dropdown / Sign In Button (Hero button primary style) */}
            <div className="relative" ref={profileRef}>
              {user ? (
                /* Signed In User Button */
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="relative inline-flex h-8 w-fit shrink-0 touch-manipulation items-center justify-center rounded-[8px] border border-solid border-white/20 bg-white px-3 font-tight text-[12px] font-medium tracking-[-0.28px] text-[#101010] shadow-[0px_2px_6px_0px_rgba(0,0,0,0.22)] transition-[opacity,transform,background-color] duration-200 ease cursor-pointer hover:opacity-90 active:scale-[0.97] gap-2"
                  title={user.name || user.email}
                >
                  <div className="relative z-10 w-4 h-4 rounded-full overflow-hidden flex-shrink-0 bg-neutral-200 border border-neutral-300">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.email)}`} alt="Avatar" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <span className="relative z-10 truncate max-w-[85px]">{user.name ? user.name.trim().split(' ')[0] : 'Account'}</span>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_2px_3px_0px_rgba(255,255,255,0.35)]"
                  />
                </button>
              ) : (
                /* Signed Out Sign In Button (Matching Hero Primary Button Style) */
                <a
                  href="/auth"
                  className="relative inline-flex h-8 w-fit shrink-0 touch-manipulation items-center justify-center rounded-[8px] border border-solid border-white/20 bg-white px-3.5 font-tight text-[12px] font-medium tracking-[-0.28px] text-[#101010] shadow-[0px_2px_6px_0px_rgba(0,0,0,0.22)] transition-[opacity,transform,background-color] duration-200 ease cursor-pointer hover:opacity-90 active:scale-[0.97]"
                >
                  <span className="relative z-10 flex items-center gap-1">
                    <GoPerson className="w-3 h-3" />
                    <span>Sign In</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_2px_3px_0px_rgba(255,255,255,0.35)]"
                  />
                </a>
              )}

              {/* Signed In Profile Dropdown */}
              {isProfileOpen && user && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-[#141417]/95 border border-white/10 backdrop-blur-2xl rounded-[16px] shadow-[0_20px_60px_rgba(0,0,0,0.85),inset_0_1px_0_0_rgba(255,255,255,0.12)] z-50 overflow-hidden flex flex-col p-1.5 animate-fade-in font-tight select-none">
                  
                  {/* User info header */}
                  <div className="p-2.5 bg-white/[0.04] border border-white/10 rounded-[12px] flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-full ring-2 ring-white/15 overflow-hidden flex-shrink-0 bg-[#232328] flex items-center justify-center">
                      {user.profileImage ? (
                        <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.email)}`} alt="Avatar" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-white truncate tracking-[-0.2px]">{user.name || 'Student Forge User'}</span>
                      <span className="text-[11px] text-white/50 font-mono truncate">{user.email}</span>
                    </div>
                  </div>

                  {/* Navigation Actions */}
                  <div className="flex flex-col gap-0.5">
                    <a
                      href="/dashboard"
                      onClick={() => setIsProfileOpen(false)}
                      className="group flex items-center justify-between px-3 py-2 text-white/80 hover:text-white hover:bg-white/[0.06] rounded-[8px] transition-all text-xs font-medium"
                    >
                      <div className="flex items-center gap-2.5">
                        <GoPerson className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
                        <span>Dashboard</span>
                      </div>
                      <GoArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-white/80 group-hover:translate-x-0.5 transition-all" />
                    </a>

                    <a
                      href="/dashboard?tab=my-tickets"
                      onClick={() => setIsProfileOpen(false)}
                      className="group flex items-center justify-between px-3 py-2 text-white/80 hover:text-white hover:bg-white/[0.06] rounded-[8px] transition-all text-xs font-medium"
                    >
                      <div className="flex items-center gap-2.5">
                        <GoBell className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
                        <span>My Tickets</span>
                      </div>
                      <GoArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-white/80 group-hover:translate-x-0.5 transition-all" />
                    </a>

                    <a
                      href="/create-event"
                      onClick={() => setIsProfileOpen(false)}
                      className="group flex items-center justify-between px-3 py-2 text-white/80 hover:text-white hover:bg-white/[0.06] rounded-[8px] transition-all text-xs font-medium"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-4 h-4 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center text-[11px] font-bold">+</span>
                        <span>Host Event</span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">New</span>
                    </a>

                    <div className="border-t border-white/10 my-1" />

                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleSignOut();
                      }}
                      className="group flex items-center justify-between px-3 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-[8px] transition-all text-xs font-medium cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <GoSignOut className="w-4 h-4 text-rose-400 group-hover:text-rose-300 transition-colors" />
                        <span>Sign Out</span>
                      </div>
                    </button>
                  </div>

                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden inline-flex h-8 w-8 items-center justify-center rounded-[8px] border border-solid border-white/20 bg-transparent text-white/80 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
            </button>

          </div>

        </nav>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden mt-2 w-full rounded-[12px] bg-[#18181c]/95 border border-white/15 backdrop-blur-2xl p-2.5 flex flex-col gap-1 shadow-[0_16px_48px_rgba(0,0,0,0.8)] animate-fade-in z-50">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 text-xs font-medium text-white/80 hover:text-white rounded-[6px] hover:bg-white/10 transition-all font-tight"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}

      </div>
    </header>
  );
}
