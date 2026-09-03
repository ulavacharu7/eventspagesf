'use client';

import React from 'react';
import { StickyBanner } from '@/components/ui/sticky-banner';

export default function GlobalStickyBanner() {
  return (
    <StickyBanner 
      autoDismissSeconds={15}
      className="relative overflow-hidden bg-[#0c0d12] text-white border-b border-white/10 shadow-lg px-4 py-2.5"
    >
      {/* Top ambient gradient glow line matching the palette (& Scale style) */}
      <div 
        className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-fuchsia-500 via-rose-500 via-orange-500 to-amber-400 opacity-90" 
        aria-hidden="true"
      />

      {/* Subtle radial ambient background glow */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(244,63,94,0.08),transparent_70%)] pointer-events-none" 
        aria-hidden="true"
      />

      {/* Main Banner Message Content */}
      <div className="relative z-10 flex items-center justify-center text-center max-w-[85%] sm:max-w-[90%] mx-auto">
        {/* Message Text: Highly visible, stable, clean font */}
        <p className="text-xs sm:text-sm font-medium text-zinc-100 tracking-normal antialiased leading-snug">
          <span>Sorry for the issues with our server — </span>
          <span className="font-semibold text-white">we are fully back online!</span>
        </p>
      </div>

      {/* Bottom subtle edge divider */}
      <div 
        className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" 
        aria-hidden="true"
      />
    </StickyBanner>
  );
}
