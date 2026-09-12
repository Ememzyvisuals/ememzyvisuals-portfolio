"use client";
// components/ui/PetPeek.tsx
//
// A small illustrated pet that peeks up from the bottom edge of the
// Contact section and swaps between real eye-direction frames based on
// where the cursor is (left/right/up/center), blinks on its own on a
// timer, and blinks on tap/click too. Relies on the parent <section>
// having `relative overflow-hidden` so it can clip the pet while it's
// tucked below the fold.

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

type Gaze = "center" | "left" | "right" | "up";

const FRAMES: Record<Gaze, string> = {
  center: "/images/pet/pet-center.png",
  left: "/images/pet/pet-left.png",
  right: "/images/pet/pet-right.png",
  up: "/images/pet/pet-up.png",
};
const BLINK_FRAME = "/images/pet/pet-blink.png";

export function PetPeek() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapperRef, { once: true, margin: "-80px" });
  const [gaze, setGaze] = useState<Gaze>("center");
  const [blinking, setBlinking] = useState(false);
  const blinkTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Preload every frame once on mount so switching gaze/blink is instant.
  useEffect(() => {
    [...Object.values(FRAMES), BLINK_FRAME].forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  // Cursor tracking — picks the nearest of the 4 real eye-direction
  // frames based on the pointer's angle relative to the pet's head.
  useEffect(() => {
    function handlePointerMove(e: PointerEvent) {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height * 0.25;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;

      const dist = Math.hypot(dx, dy);
      if (dist < 40) {
        setGaze("center");
        return;
      }

      const angle = Math.atan2(dy, dx);
      const deg = (angle * 180) / Math.PI;

      if (deg < -35 && deg > -145) {
        setGaze("up");
      } else if (deg >= -35 && deg <= 55) {
        setGaze("right");
      } else {
        setGaze("left");
      }
    }
    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  // A single blink, callable from the idle timer OR a tap/click.
  const triggerBlink = useCallback((andThen?: () => void) => {
    setBlinking(true);
    blinkTimeoutRef.current = setTimeout(() => {
      setBlinking(false);
      andThen?.();
    }, 160);
  }, []);

  // Idle blink every 2-5s, with an occasional quick double-blink.
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    function scheduleBlink() {
      const delay = 2000 + Math.random() * 3000;
      timeout = setTimeout(() => {
        triggerBlink(() => {
          if (Math.random() < 0.3) {
            setTimeout(() => triggerBlink(scheduleBlink), 180);
          } else {
            scheduleBlink();
          }
        });
      }, delay);
    }
    scheduleBlink();
    return () => {
      clearTimeout(timeout);
      clearTimeout(blinkTimeoutRef.current);
    };
  }, [triggerBlink]);

  return (
    <div
      ref={wrapperRef}
      className="absolute bottom-[-24px] right-4 sm:right-12 w-[200px] sm:w-[260px] z-10"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: inView ? "0%" : "100%" }}
        transition={{ type: "spring", stiffness: 120, damping: 16, delay: 0.3 }}
        onClick={() => triggerBlink()}
        onTouchStart={() => triggerBlink()}
        className="cursor-pointer"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={blinking ? BLINK_FRAME : FRAMES[gaze]}
          alt=""
          className="w-full h-auto select-none block"
          draggable={false}
        />
      </motion.div>
    </div>
  );
}
