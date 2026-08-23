'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GoShieldCheck, GoX } from 'react-icons/go';

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('sf_cookie_consent');
      if (!consent) {
        // Show after a brief delay for smooth appearance
        const timer = setTimeout(() => setShowConsent(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('sf_cookie_consent', 'accepted');
    } catch {
      // ignore
    }
    setShowConsent(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem('sf_cookie_consent', 'declined');
    } catch {
      // ignore
    }
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 max-w-sm bg-[#18181c]/95 border border-white/12 backdrop-blur-2xl rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.85)] font-tight text-white select-none animate-fade-in flex flex-col gap-3">
      
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-white/80">
            <GoShieldCheck className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold text-white tracking-tight">Cookie Preferences</span>
        </div>

        <button
          onClick={handleDecline}
          className="text-white/40 hover:text-white transition-colors p-0.5 cursor-pointer"
          aria-label="Dismiss cookie banner"
        >
          <GoX className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-white/60 font-normal leading-relaxed">
        We use cookies to maintain your login session, authenticate tickets, and ensure seamless registration.{' '}
        <Link href="/help" className="text-white/80 hover:text-white underline">
          Privacy Policy
        </Link>
      </p>

      <div className="flex items-center justify-end gap-2 pt-1 border-t border-white/5">
        <button
          type="button"
          onClick={handleDecline}
          className="px-3 py-1.5 text-xs text-white/60 hover:text-white rounded-[7px] hover:bg-white/5 transition-colors cursor-pointer font-medium"
        >
          Decline
        </button>

        <button
          type="button"
          onClick={handleAccept}
          className="px-3.5 py-1.5 text-xs font-semibold text-[#101010] bg-white rounded-[7px] hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-sm"
        >
          Accept
        </button>
      </div>

    </div>
  );
}
