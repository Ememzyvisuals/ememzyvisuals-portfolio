"use client";
// components/sections/HeroScroll.tsx
// As the page scrolls past the hero: the word drifts down a little, the character rises and the side text fades, so
// the layers move at different speeds (sets --hs, 0 at the top to 1 when the hero has left the screen).
import { useEffect } from "react";

export function HeroScroll() {
  useEffect(() => {
    const el = document.getElementById("hero");
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = el.offsetHeight || 1;
        el.style.setProperty("--hs", String(Math.min(1, Math.max(0, window.scrollY / h))));
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => { window.removeEventListener("scroll", on); cancelAnimationFrame(raf); };
  }, []);
  return null;
}
