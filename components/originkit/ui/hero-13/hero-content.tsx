// Delivered by Originkit · stack: nextjs · styling: tailwind
"use client";

import { motion } from "motion/react";
import { Button } from "@/components/originkit/ui/hero-13/button";

type HeroContentProps = {
  onExploreEvents: () => void;
  onHostEvent: () => void;
};

export const HeroContent = ({
  onExploreEvents,
  onHostEvent,
}: HeroContentProps) => {
  return (
    <div className="relative z-20 flex w-full items-center justify-center py-4">
      <div className="relative z-10 flex w-full flex-col items-center gap-6 px-4 text-center ipad:gap-8">
        <div className="flex w-full flex-col items-center gap-4">
          <h1 className="w-full font-instrument-serif text-[40px] sm:text-[56px] leading-[1.08] tracking-[-1.44px] text-white text-balance ipad:text-[68px] ipad:leading-[70px] ipad:tracking-[-2.04px] desktop-sm:text-[68px] desktop-sm:leading-[70px] desktop-sm:tracking-[-2.04px]">
            Host, Discover &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d946ef] via-[#f97316] to-[#fbbf24]">
              Scale
            </span>{" "}
            Campus Tech Events
          </h1>

          <div className="flex w-full flex-col items-center gap-6 ipad:gap-8">
            <p className="w-full max-w-[560px] font-tight text-[15px] sm:text-[16px] leading-[1.5] tracking-[-0.32px] text-white/75 text-pretty ipad:text-[17px] ipad:leading-[25.5px] ipad:tracking-[-0.34px]">
              Host, discover, and scale technical hackathons, summits, and workshops across global university chapters with automated ticket generation and check-in QR passes.
            </p>

            <div className="flex w-auto flex-row items-center gap-3 ipad:gap-4">
              <Button
                variant="primary"
                aria-label="Explore Events"
                onClick={onExploreEvents}
                className="w-fit"
              >
                Explore Events
              </Button>
              <Button
                variant="secondary"
                aria-label="Host Event"
                onClick={onHostEvent}
                className="w-fit"
              >
                Host Event +
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
