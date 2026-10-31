"use client";
// components/ui/PetPeek.tsx
//
// A small pet drawn entirely in SVG (no source images at all, sidesteps
// every background-removal/alignment problem from earlier attempts).
// Peeks up from the bottom-right of the Contact section, blinks on a
// timer and on tap, and the pupils continuously track the cursor by real
// coordinate translation, not frame-swapping, so it's smooth at any
// angle, not just a handful of discrete directions.

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const EAR = "#1a1a1a";
const HEAD = "#242424";
const STRIPE = "#f4ede4";
const BROW = "#f4ede4";
const NOSE = "#0a0a0a";
const PAW = "#f4ede4";
const PAW_LINE = "#242424";

// How far the pupil can travel from center, in SVG units.
const PUPIL_RANGE = 3.2;

export function PetPeek() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapperRef, { once: true, margin: "-80px" });
  const [pupil, setPupil] = useState({ x: 0, y: 0 });
  const [blinking, setBlinking] = useState(false);
  const blinkTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Real continuous pupil tracking, a coordinate transform, not a
  // discrete frame swap, so it's smooth at any cursor angle.
  useEffect(() => {
    function handlePointerMove(e: PointerEvent) {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height * 0.35;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.hypot(dx, dy) || 1;
      const clamped = Math.min(dist, 400) / 400; // 0..1 travel amount

      setPupil({
        x: (dx / dist) * PUPIL_RANGE * clamped,
        y: (dy / dist) * PUPIL_RANGE * clamped,
      });
    }
    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  const triggerBlink = () => {
    setBlinking(true);
    blinkTimeoutRef.current = setTimeout(() => setBlinking(false), 150);
  };

  // Idle blink every 2-5s, occasional natural double-blink.
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    function scheduleBlink() {
      const delay = 2000 + Math.random() * 3000;
      timeout = setTimeout(() => {
        setBlinking(true);
        setTimeout(() => {
          setBlinking(false);
          if (Math.random() < 0.3) {
            setTimeout(() => {
              setBlinking(true);
              setTimeout(() => setBlinking(false), 150);
              scheduleBlink();
            }, 180);
          } else {
            scheduleBlink();
          }
        }, 150);
      }, delay);
    }
    scheduleBlink();
    return () => {
      clearTimeout(timeout);
      clearTimeout(blinkTimeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="absolute bottom-[-8px] right-4 sm:right-12 w-[150px] sm:w-[190px] z-10"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: inView ? "0%" : "100%" }}
        transition={{ type: "spring", stiffness: 120, damping: 16, delay: 0.3 }}
        onClick={triggerBlink}
        onTouchStart={triggerBlink}
        className="cursor-pointer"
      >
        <svg viewBox="0 0 100 70" className="w-full h-auto select-none" aria-hidden="true">
          {/* Ears */}
          <path d="M 12 30 L 4 4 L 32 22 Z" fill={EAR} />
          <path d="M 88 30 L 96 4 L 68 22 Z" fill={EAR} />

          {/* Head */}
          <path
            d="M 50 8
               C 30 8, 16 22, 16 40
               L 16 70 L 84 70 L 84 40
               C 84 22, 70 8, 50 8 Z"
            fill={HEAD}
          />

          {/* Center stripe */}
          <path d="M 44 10 L 56 10 L 53 55 L 47 55 Z" fill={STRIPE} />

          {/* Eyebrows */}
          <rect x="26" y="26" width="14" height="4.5" rx="2.2" fill={BROW} />
          <rect x="60" y="26" width="14" height="4.5" rx="2.2" fill={BROW} />

          {/* Left eye */}
          <motion.g
            animate={{ scaleY: blinking ? 0.08 : 1 }}
            transition={{ duration: 0.09 }}
            style={{ originX: "33px", originY: "40px" }}
          >
            <ellipse cx="33" cy="40" rx="9" ry="9" fill="#faf7f2" />
            <circle
              cx={33 + pupil.x}
              cy={40 + pupil.y}
              r="4.4"
              fill="#3a2a1f"
            />
            <circle cx={34.5 + pupil.x} cy={38 + pupil.y} r="1.3" fill="#fff" />
          </motion.g>

          {/* Right eye */}
          <motion.g
            animate={{ scaleY: blinking ? 0.08 : 1 }}
            transition={{ duration: 0.09 }}
            style={{ originX: "67px", originY: "40px" }}
          >
            <ellipse cx="67" cy="40" rx="9" ry="9" fill="#faf7f2" />
            <circle
              cx={67 + pupil.x}
              cy={40 + pupil.y}
              r="4.4"
              fill="#3a2a1f"
            />
            <circle cx={68.5 + pupil.x} cy={38 + pupil.y} r="1.3" fill="#fff" />
          </motion.g>

          {/* Nose */}
          <path d="M 45 52 L 55 52 L 50 58 Z" fill={NOSE} />
          <ellipse cx="50" cy="51" rx="6.5" ry="4.5" fill={NOSE} />

          {/* Paws resting on the edge */}
          <g>
            <rect x="14" y="60" width="20" height="12" rx="6" fill={PAW} />
            <line x1="19" y1="60" x2="19" y2="70" stroke={PAW_LINE} strokeWidth="1.2" />
            <line x1="24" y1="60" x2="24" y2="70" stroke={PAW_LINE} strokeWidth="1.2" />
            <line x1="29" y1="60" x2="29" y2="70" stroke={PAW_LINE} strokeWidth="1.2" />

            <rect x="66" y="60" width="20" height="12" rx="6" fill={PAW} />
            <line x1="71" y1="60" x2="71" y2="70" stroke={PAW_LINE} strokeWidth="1.2" />
            <line x1="76" y1="60" x2="76" y2="70" stroke={PAW_LINE} strokeWidth="1.2" />
            <line x1="81" y1="60" x2="81" y2="70" stroke={PAW_LINE} strokeWidth="1.2" />
          </g>
        </svg>
      </motion.div>
    </div>
  );
}
