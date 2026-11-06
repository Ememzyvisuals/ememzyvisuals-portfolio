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
    // (the character turns towards the cursor: --mx and --my from -1 to 1, eased so the turn stays smooth)
    let mx = 0, my = 0, tx = 0, ty = 0, raf2 = 0;
    const fine = window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const step = () => {
      mx += (tx - mx) * 0.08; my += (ty - my) * 0.08;
      el.style.setProperty("--mx", mx.toFixed(4)); el.style.setProperty("--my", my.toFixed(4));
      raf2 = Math.abs(tx - mx) + Math.abs(ty - my) > 0.001 ? requestAnimationFrame(step) : 0;
    };
    const look = (e: PointerEvent) => {
      tx = Math.max(-1, Math.min(1, (e.clientX / window.innerWidth) * 2 - 1));
      ty = Math.max(-1, Math.min(1, (e.clientY / window.innerHeight) * 2 - 1));
      if (!raf2) raf2 = requestAnimationFrame(step);
    };
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("pointermove", look); cancelAnimationFrame(raf2); window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, [count]);
  return null;
}
