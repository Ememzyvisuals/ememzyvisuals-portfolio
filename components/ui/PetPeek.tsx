"use client";
// components/ui/PetPeek.tsx
//
// A small illustrated pet that peeks up from the bottom edge of a section,
// gently tilts/shifts toward the cursor (a lightweight stand-in for true
// per-frame eye-direction art, since the current asset set only has a
// center-gaze + blink frame), and blinks on a random idle timer.

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

export function PetPeek() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-80px" });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [blinking, setBlinking] = useState(false);

  // Cursor tracking — tilts/shifts the whole pet toward the pointer,
  // capped to a small natural-looking range.
  useEffect(() => {
    function handlePointerMove(e: PointerEvent) {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height * 0.3; // roughly the eye line

      const dx = (e.clientX - centerX) / (window.innerWidth / 2);
      const dy = (e.clientY - centerY) / (window.innerHeight / 2);

      setTilt({
        x: Math.max(-1, Math.min(1, dx)),
        y: Math.max(-1, Math.min(1, dy)),
      });
    }
    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  // Idle blink every 3-6s
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

  const rotate = tilt.x * 5; // max ~5deg
  const translateX = tilt.x * 10; // max ~10px
  const translateY = tilt.y * 4; // max ~4px, subtle

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute bottom-0 right-6 sm:right-12 w-[110px] sm:w-[150px] overflow-hidden"
      style={{ height: inView ? 90 : 0 }}
      aria-hidden="true"
    >
      <motion.div
        initial={{ y: "70%" }}
        animate={{ y: inView ? "18%" : "70%" }}
        transition={{ type: "spring", stiffness: 120, damping: 16, delay: 0.3 }}
        style={{
          rotate,
          x: translateX,
          y: translateY,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={blinking ? "/images/pet/pet-blink.png" : "/images/pet/pet-peek.png"}
          alt=""
          width={300}
          height={300}
          className="w-full h-auto select-none"
          draggable={false}
        />
      </motion.div>
    </div>
  );
}
