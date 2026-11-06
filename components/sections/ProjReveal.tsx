"use client";
// components/sections/ProjReveal.tsx
// Marks each project row as it scrolls into view, so its text slides in from its own side (see globals.css).
import { useEffect } from "react";

export function ProjReveal() {
  useEffect(() => {
    const rows = document.querySelectorAll<HTMLElement>("#showcase .proj-row");
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")), { threshold: 0.25 });
    rows.forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, []);
  return null;
}
