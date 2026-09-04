'use client';

import React from 'react';
import { StickyBanner } from '@/components/ui/sticky-banner';

export default function GlobalStickyBanner() {
  return (
    <StickyBanner 
      autoDismissSeconds={0}
      className="bg-gradient-to-r from-[#d946ef] via-[#f97316] to-[#fbbf24] text-zinc-950 px-4 py-2 border-b border-black/10 shadow-md"
      closeButtonClassName="text-zinc-950/80 hover:text-zinc-950 hover:bg-black/15 focus:ring-1 focus:ring-black/30"
    >
      <div className="flex items-center justify-center text-center max-w-[85%] sm:max-w-[90%] mx-auto">
        <p className="text-xs sm:text-sm font-bold text-black tracking-tight antialiased leading-snug">
          Server issues resolved — all event services and registrations are fully operational.
        </p>
      </div>
    </StickyBanner>
  );
}



