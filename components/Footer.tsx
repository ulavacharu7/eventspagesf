'use client';

import React from 'react';

export interface FooterProps {
  isLight?: boolean;
}

const Footer: React.FC<FooterProps> = ({ isLight = false }) => {
  const bgClass = isLight ? 'bg-neutral-50/80' : 'bg-[#121214]';
  const textClass = isLight ? 'text-neutral-700' : 'text-[#8a8a90]';
  const borderClass = isLight ? 'border-t border-neutral-300/60' : 'border-t border-[#222226]';
  const subBorderClass = isLight ? 'border-t border-neutral-300/40' : 'border-t border-[#222226]';
  const linkHoverClass = isLight ? 'hover:text-black' : 'hover:text-white';
  const subTextClass = isLight ? 'text-neutral-600' : 'text-[#71717a]';
  const poweredByClass = isLight ? 'text-neutral-800' : 'text-[#a1a1aa]';
  const poweredLinkClass = isLight ? 'text-neutral-900 hover:text-emerald-600' : 'text-white hover:text-emerald-400';
  const cardBgClass = isLight ? 'bg-white border-neutral-200 shadow-sm' : 'bg-[#18181c] border-[#292932] shadow-lg';
  const iconClass = isLight 
    ? 'bg-neutral-100 border border-neutral-300/60 hover:bg-neutral-200 text-neutral-600 hover:text-black' 
    : 'bg-[#222226] border border-[#2e2e34] hover:bg-[#2a2a30] hover:border-[#44444a] text-neutral-400 hover:text-white';

  return (
    <footer className={`w-full pt-14 pb-10 px-4 sm:px-8 lg:px-12 z-10 relative ${bgClass} ${textClass} ${borderClass}`}>
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        
        {/* Top Emergency / Ticket & Payment Support Hotline Card */}
        <div className={`w-full p-5 sm:p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${cardBgClass}`}>
          <div className="flex items-start gap-3.5 max-w-xl">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5 text-lg">
              💬
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                Direct Helpdesk &amp; Payment Desk
              </span>
              <h4 className="text-sm sm:text-base font-bold text-white font-tight leading-snug">
                Facing issues with your tickets, bookings, or payments?
              </h4>
              <p className="text-xs text-[#a1a1aa] leading-relaxed">
                Our support team is active to verify your transactions, resolve ticket issuance, and assist immediately.
              </p>
            </div>
          </div>

          {/* Quick Contact Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <a
              href="tel:+916304218064"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-mono text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
              title="Call Helpline 1"
            >
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>+91 6304218064</span>
            </a>

            <a
              href="tel:+916309917327"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-mono text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
              title="Call Helpline 2"
            >
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>+91 6309917327</span>
            </a>

            <a
              href="mailto:info@studentforge.in"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#d4d4d8] text-xs font-medium transition-all"
              title="Email Support"
            >
              <span>✉️ info@studentforge.in</span>
            </a>
          </div>
        </div>

        {/* Middle Navigation Grid: Brand, Quick Links, Legal & Compliance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-2">
          
          {/* Column 1: Brand & Identity */}
          <div className="flex flex-col gap-3 sm:col-span-2 lg:col-span-1">
            <a href="/" className="flex items-center group w-fit" aria-label="Student Forge Home">
              <img
                src="https://ik.imagekit.io/dypkhqxip/sf-events-svg?updatedAt=1787505496001"
                alt="Student Forge Events"
                className="h-10 sm:h-12 w-auto object-contain select-none opacity-90 group-hover:opacity-100 transition-opacity"
                style={{ filter: isLight ? 'brightness(0.3)' : 'brightness(0) invert(0.88)' }}
                draggable={false}
              />
            </a>
            <p className="text-xs text-[#a1a1aa] leading-relaxed max-w-xs">
              Empowering student innovators, builders, and college ecosystems with next-generation event experiences, instant QR passes, and verified ticketing.
            </p>
            <div className="text-[11px] font-mono text-[#71717a] pt-1">
              Registered in Hyderabad, Telangana, India.
            </div>
          </div>

          {/* Column 2: Platform Links */}
          <div className="flex flex-col gap-2.5 text-xs sm:text-sm">
            <span className="font-mono text-[11px] uppercase tracking-wider text-white font-semibold mb-1">
              Platform
            </span>
            <a href="/events" className={`transition-colors ${linkHoverClass}`}>
              Explore Events
            </a>
            <a href="/explore" className={`transition-colors ${linkHoverClass}`}>
              Campus Hubs
            </a>
            <a href="/create-event" className={`transition-colors ${linkHoverClass}`}>
              Host an Event
            </a>
            <a href="/event-essentials" className={`transition-colors ${linkHoverClass}`}>
              Event Essentials
            </a>
            <a href="/dashboard" className={`transition-colors ${linkHoverClass}`}>
              Organizer Dashboard
            </a>
          </div>

          {/* Column 3: Legal & Regulatory (Indian Laws) */}
          <div className="flex flex-col gap-2.5 text-xs sm:text-sm">
            <span className="font-mono text-[11px] uppercase tracking-wider text-white font-semibold mb-1">
              Legal &amp; Compliance
            </span>
            <a href="/privacy" className={`transition-colors ${linkHoverClass} flex items-center gap-1.5`}>
              <span>Privacy Policy</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/15 text-indigo-300">DPDPA</span>
            </a>
            <a href="/cookies" className={`transition-colors ${linkHoverClass}`}>
              Cookies Policy
            </a>
            <a href="/payment-terms" className={`transition-colors ${linkHoverClass} flex items-center gap-1.5`}>
              <span>Payment &amp; Refund Terms</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300">RBI/GST</span>
            </a>
            <a href="/terms" className={`transition-colors ${linkHoverClass}`}>
              Terms of Service
            </a>
            <a href="/help" className={`transition-colors ${linkHoverClass}`}>
              Help &amp; Support Center
            </a>
          </div>

          {/* Column 4: Social & Direct Lines */}
          <div className="flex flex-col gap-3 text-xs sm:text-sm">
            <span className="font-mono text-[11px] uppercase tracking-wider text-white font-semibold mb-1">
              Connect &amp; Support
            </span>
            <div className="flex flex-col gap-1.5 text-xs text-[#a1a1aa] font-mono">
              <span className="text-[#71717a] text-[10px] uppercase">Direct Support Lines:</span>
              <a href="tel:+916304218064" className="hover:text-white transition-colors">
                📞 +91 6304218064
              </a>
              <a href="tel:+916309917327" className="hover:text-white transition-colors">
                📞 +91 6309917327
              </a>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://www.instagram.com/studentforge/"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 shadow-sm group ${iconClass}`}
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>

              <a
                href="mailto:info@studentforge.in"
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 shadow-sm group ${iconClass}`}
                aria-label="Email"
              >
                <svg className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Sub-Footer: Copyright, Compliance & Powered by Studio Redlix */}
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-6 text-xs ${subTextClass} ${subBorderClass}`}>
          <div className="text-center sm:text-left leading-relaxed">
            © {new Date().getFullYear()} <strong>Student Forge Technologies Private Limited</strong>. All rights reserved.
          </div>

          <div className={`flex items-center gap-1.5 text-xs ${poweredByClass}`}>
            <span>Powered by</span>
            <a
              href="https://www.redlix.co.in"
              target="_blank"
              rel="noopener noreferrer"
              className={`font-semibold tracking-wide transition-colors cursor-pointer ${poweredLinkClass}`}
            >
              Studio Redlix
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
