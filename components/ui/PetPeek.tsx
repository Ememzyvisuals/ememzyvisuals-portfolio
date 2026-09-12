"use client";
// components/ui/PetPeek.tsx
//
// A small illustrated pet that peeks up from the bottom edge of the
// Contact section. Uses the two original uploaded frames completely
// unedited (only the minimum necessary black->transparent conversion,
// no cropping/rescaling) — blinks on its own on a timer and on tap/click,
// and does a subtle whole-image cursor tilt for liveliness (a runtime
// CSS transform, not an edit to the source art).

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const OPEN_FRAME = "/images/pet/pet-open.png";
const BLINK_FRAME = "/images/pet/pet-blink.png";

export function PetPeek() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapperRef, { once: true, margin: "-80px" });
  const [blinking, setBlinking] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const blinkTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    [OPEN_FRAME, BLINK_FRAME].forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  // Subtle cursor tilt on the whole image — liveliness without touching
  // the source frames at all.
  useEffect(() => {
    function handlePointerMove(e: PointerEvent) {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top;
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

  const rotate = tilt.x * 4;
  const translateX = tilt.x * 8;

  return (
    <div
      ref={wrapperRef}
      className="absolute bottom-[-24px] right-4 sm:right-12 w-[200px] sm:w-[260px] z-10"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: inView ? "0%" : "100%" }}
        transition={{ type: "spring", stiffness: 120, damping: 16, delay: 0.3 }}
      >
        <motion.div
          style={{ rotate, x: translateX }}
          onClick={() => triggerBlink()}
          onTouchStart={() => triggerBlink()}
          className="cursor-pointer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={blinking ? BLINK_FRAME : OPEN_FRAME}
            alt=""
            className="w-full h-auto select-none block"
            draggable={false}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
