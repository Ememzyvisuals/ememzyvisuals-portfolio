"use client";
// components/sections/HeroScroll.tsx
// Drives the hero's slides from the scroll: the hero is several screens tall and its inside stays pinned, so as the
// page scrolls through it the active slide (data-slide on the section) moves on, and --hp gives the progress within
// the current slide for the small drift of the layers.
import { useEffect } from "react";

export function HeroScroll({ count }: { count: number }) {
  useEffect(() => {
    const el = document.getElementById("hero");
    if (!el) return;
    let raf = 0, cur = -1;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const vh = window.innerHeight || 1;
        const run = Math.max(1, el.offsetHeight - vh);
        const t = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / run)) * count;
        const i = Math.min(count - 1, Math.floor(t));
        if (i !== cur) { cur = i; el.dataset.slide = String(i); }
        el.style.setProperty("--hp", String(Math.min(1, t - i)));
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, [count]);
  return null;
}
