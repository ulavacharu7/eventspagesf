"use client";
import React, { SVGProps, useState, useEffect } from "react";
import { motion, useMotionValueEvent, useScroll, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export const StickyBanner = ({
  className,
  children,
  hideOnScroll = false,
  autoDismissSeconds = 15,
}: {
  className?: string;
  children: React.ReactNode;
  hideOnScroll?: boolean;
  autoDismissSeconds?: number;
}) => {
  const [open, setOpen] = useState(true);
  const { scrollY } = useScroll();

  // Auto-dismiss after specified seconds (defaults to 15 seconds)
  useEffect(() => {
    if (!autoDismissSeconds || autoDismissSeconds <= 0) return;

    const timer = setTimeout(() => {
      setOpen(false);
    }, autoDismissSeconds * 1000);

    return () => clearTimeout(timer);
  }, [autoDismissSeconds]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (hideOnScroll && latest > 40) {
      setOpen(false);
    } else if (hideOnScroll && latest <= 40) {
      setOpen(true);
    }
  });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={cn(
            "sticky inset-x-0 top-0 z-50 flex min-h-12 w-full items-center justify-center bg-[#0d0e12] px-4 py-2 border-b border-white/10 shadow-md",
            className,
          )}
          initial={{
            y: -60,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          exit={{
            y: -60,
            opacity: 0,
            transition: { duration: 0.3, ease: "easeInOut" },
          }}
          transition={{
            duration: 0.35,
            ease: "easeOut",
          }}
        >
          {children}

          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded-full p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-1 focus:ring-white/20"
            onClick={() => setOpen(false)}
            aria-label="Dismiss banner"
          >
            <CloseIcon className="h-4 w-4" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const CloseIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </svg>
  );
};
