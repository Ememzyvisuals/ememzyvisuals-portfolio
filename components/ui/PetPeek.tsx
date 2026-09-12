"use client";
// components/ui/PetPeek.tsx
//
// A small illustrated pet that peeks up from the bottom edge of the
// Contact section and swaps between real eye-direction frames based on
// where the cursor is (left/right/up/center), plus a random idle blink.
// Relies on the parent <section> having `relative overflow-hidden` so it
// can clip the pet while it's tucked below the fold.

import { useEffect, useRef, useState } from "react";
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

  // Preload every frame once on mount so switching gaze/blink is instant
  // instead of flashing blank while a new frame's image request lands.
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

      // Dead zone near the head itself — stay center rather than jitter
      const dist = Math.hypot(dx, dy);
      if (dist < 40) {
        setGaze("center");
        return;
      }

      const angle = Math.atan2(dy, dx); // radians, 0 = right, -90deg = up
      const deg = (angle * 180) / Math.PI;

      // Bias upward gaze to a wider band since the cursor is very often
      // above the pet (it's peeking up from the bottom of the section).
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

  // Idle blink every 3-6s — briefly overrides whatever gaze is active
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    function scheduleBlink() {
      const delay = 3000 + Math.random() * 3000;
      timeout = setTimeout(() => {
        setBlinking(true);
        setTimeout(() => setBlinking(false), 140);
        scheduleBlink();
      }, delay);
    }
    scheduleBlink();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="pointer-events-none absolute bottom-0 right-4 sm:right-12 w-[200px] sm:w-[260px] z-10"
      aria-hidden="true"
    >
      <motion.div
        initial={{ y: "88%" }}
        animate={{ y: inView ? "38%" : "88%" }}
        transition={{ type: "spring", stiffness: 120, damping: 16, delay: 0.3 }}
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
