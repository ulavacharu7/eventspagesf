'use client';

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useState, KeyboardEvent } from "react";

export interface User {
  id: string | number;
  name?: string;
  image?: string | null;
}

export interface UserAvatarsProps {
  /** List of users with id, name, and optional image */
  users: User[];
  /** Avatar size in px (default: 56) */
  size?: number | string;
  /** Extra classNames for container */
  className?: string;
  /** Max number of visible avatars before showing +X bubble (default: 7) */
  maxVisible?: number;
  /** Overlap percentage between avatars (default: 60) */
  overlap?: number;
  /** Hover scale factor (default: 1.2) */
  focusScale?: number;
  /** Display avatars from right to left (default: false) */
  isRightToLeft?: boolean;
  /** Only overlap avatars, no shifting on hover (default: false) */
  isOverlapOnly?: boolean;
  /** Tooltip placement (default: "bottom") */
  tooltipPlacement?: "top" | "bottom";
}

function getInitials(name?: string): string {
  if (!name || !name.trim()) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Distinct, soft muted ambient color themes for initials
const AVATAR_SOFT_THEMES = [
  'bg-gradient-to-br from-[#352c48] to-[#201a2d] text-purple-200 border-purple-400/20',
  'bg-gradient-to-br from-[#243c33] to-[#162721] text-emerald-200 border-emerald-400/20',
  'bg-gradient-to-br from-[#27364d] to-[#182333] text-sky-200 border-sky-400/20',
  'bg-gradient-to-br from-[#442733] to-[#2b1720] text-rose-200 border-rose-400/20',
  'bg-gradient-to-br from-[#3e3222] to-[#261f14] text-amber-200 border-amber-400/20',
  'bg-gradient-to-br from-[#2a3152] to-[#1a1e34] text-indigo-200 border-indigo-400/20',
  'bg-gradient-to-br from-[#1f3b39] to-[#132524] text-teal-200 border-teal-400/20',
  'bg-gradient-to-br from-[#422c24] to-[#2a1a14] text-orange-200 border-orange-400/20',
];

function getBgForName(name?: string, index: number = 0): string {
  if (!name) return AVATAR_SOFT_THEMES[index % AVATAR_SOFT_THEMES.length];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % AVATAR_SOFT_THEMES.length;
  return AVATAR_SOFT_THEMES[idx];
}

const AvatarItem = ({ user, index, size }: { user: User; index: number; size: number | string }) => {
  const [imgError, setImgError] = useState(false);
  const hasImage = Boolean(user.image && !imgError && user.image.trim() !== '');

  if (hasImage && user.image) {
    return (
      <img
        src={user.image}
        alt={user.name || "User"}
        className="w-full h-full object-cover select-none"
        onError={() => setImgError(true)}
      />
    );
  }

  const initials = getInitials(user.name);
  const themeClass = getBgForName(user.name, index);

  return (
    <div
      className={cn(
        "w-full h-full flex items-center justify-center font-medium font-tight select-none border tracking-wider",
        themeClass
      )}
      style={{ fontSize: typeof size === 'number' ? `${Math.max(11, Math.round(size * 0.35))}px` : '13px' }}
    >
      <span>{initials}</span>
    </div>
  );
};

export const UserAvatars = ({
  users,
  size = 56,
  className,
  maxVisible = 7,
  isRightToLeft = false,
  isOverlapOnly = false,
  overlap = 60,
  focusScale = 1.2,
  tooltipPlacement = "bottom",
}: UserAvatarsProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const slicedUsers = users.slice(
    0,
    Math.min(maxVisible + 1, users.length + 1)
  );
  const exceedMaxLength = users.length > maxVisible;

  const handleKeyEnter = (e: KeyboardEvent<HTMLDivElement>, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      setHoveredIndex(index);
    }
  };

  return (
    <div className={cn("flex items-center relative", className)}>
      {slicedUsers.map((user, index) => {
        const isHoveredOne = hoveredIndex === index;
        const isLengthBubble = exceedMaxLength && maxVisible === index;

        const diff = 1 - overlap / 100;
        const zIndex =
          isHoveredOne && isOverlapOnly
            ? slicedUsers.length
            : isRightToLeft
            ? slicedUsers.length - index
            : index;

        const shouldScale =
          isHoveredOne &&
          (!exceedMaxLength || slicedUsers.length - 1 !== index);

        const shouldShift =
          hoveredIndex !== null &&
          (isRightToLeft ? index < hoveredIndex : index > hoveredIndex) &&
          !isOverlapOnly;

        const baseGap = Number(size) * (overlap / 100);
        const neededGap = (Number(size) * (1 + focusScale)) / 2;
        const shift = Math.max(0, neededGap - baseGap);

        return (
          <motion.div
            key={user.id}
            role="img"
            aria-label={user.name || "User avatar"}
            className="relative cursor-pointer outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-full"
            style={{
              width: size,
              height: size,
              zIndex,
              marginLeft: index === 0 ? 0 : -Number(size) * diff,
            }}
            tabIndex={0}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onFocus={() => setHoveredIndex(index)}
            onBlur={() => setHoveredIndex(null)}
            onKeyDown={(e) => handleKeyEnter(e, index)}
            animate={{
              scale: shouldScale ? focusScale : 1,
              x: shouldShift ? shift * (isRightToLeft ? -1 : 1) : 0,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            {/* Avatar bubble */}
            <div className="w-full h-full rounded-full overflow-hidden ring-2 ring-[#141416] bg-[#222226] shadow-lg">
              {isLengthBubble ? (
                <div className="flex h-full w-full items-center justify-center bg-[#25252b] text-white text-xs sm:text-sm font-bold font-tight select-none">
                  +{users.length - maxVisible}
                </div>
              ) : (
                <AvatarItem user={user} index={index} size={size} />
              )}
            </div>

            {/* Tooltip */}
            <AnimatePresence>
              {shouldScale && user.name && (
                <motion.div
                  role="tooltip"
                  initial={{
                    opacity: 0,
                    y: tooltipPlacement === "bottom" ? 8 : -8,
                  }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    y: tooltipPlacement === "bottom" ? 8 : -8,
                  }}
                  transition={{ duration: 0.18 }}
                  // IMPORTANT: don't put -translate-x on this element
                  className={cn(
                    "absolute left-1/2 z-50 pointer-events-none",
                    tooltipPlacement === "bottom"
                      ? "top-full mt-2"
                      : "bottom-full mb-2"
                  )}
                >
                  {/* Inner wrapper applies the translateX via CSS (not overridden by Framer) */}
                  <div className="transform -translate-x-1/2 whitespace-nowrap rounded-md bg-neutral-900/95 border border-white/10 text-white text-xs px-2.5 py-1 font-medium font-tight shadow-xl backdrop-blur-md">
                    {user.name}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};
