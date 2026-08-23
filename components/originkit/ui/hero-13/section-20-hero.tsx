// Delivered by Originkit · stack: nextjs · styling: tailwind
"use client";

import GalleryTunnel from "@/components/originkit/ui/hero-13/gallery-tunnel";
import { HeroContent } from "@/components/originkit/ui/hero-13/hero-content";

/** Public asset under /originkit/hero-13/ */
function asset(file: string) {
  return `/originkit/hero-13/${file}`;
}

const DEFAULT_IMAGES = [
  "https://ik.imagekit.io/dypkhqxip/IMG_9667.JPG",
  "https://ik.imagekit.io/dypkhqxip/IMG_9665.JPG",
  "https://ik.imagekit.io/dypkhqxip/IMG_9670.JPG",
  "https://ik.imagekit.io/dypkhqxip/IMG_9710.JPG",
  "https://ik.imagekit.io/dypkhqxip/WhatsApp%20Image%202026-07-25%20at%2023.30.41%20(2).jpeg?updatedAt=1785002497137",
];

export const Section20Hero = () => {
  const handleExplore = () => {
    const el = document.getElementById("events-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/explore";
    }
  };

  const handleHostEvent = () => {
    window.location.href = "/create-event";
  };

  return (
    <section
      aria-label="Host, Discover & Scale Campus Tech Events"
      className="relative isolate flex min-h-svh w-full items-center justify-center overflow-hidden bg-[#131313]"
    >
      {/* 3D portrait/events tunnel */}
      <div
        aria-hidden="true"
        className="pointer-events-auto absolute inset-0 z-0"
      >
        <GalleryTunnel
          images={DEFAULT_IMAGES}
          background="#131313"
          lineColor="#B0B0B0"
          lineOpacity={0}
          grid={2}
          speed={40}
          boost={80}
          fade={100}
          label={false}
        />
      </div>

      {/* Smooth radial vignette wash behind text so copy stays readable while 3D images blend naturally */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 z-10 h-[80vh] w-[100vw] wide-lg:w-[50vw] wide-lg:h-[50vh] ipad:w-[75vw] desktop-sm:w-[85vh] desktop-sm:w-[55vw] -translate-x-1/2 -translate-y-1/2 bg-[#131313] blur-[25px]"
      />

      <div className="pointer-events-none relative z-20 flex w-full max-w-[850px] items-center justify-center py-12">
        <div className="pointer-events-auto relative flex w-full items-center justify-center">
          <HeroContent
            onExploreEvents={handleExplore}
            onHostEvent={handleHostEvent}
          />
        </div>
      </div>
    </section>
  );
};
