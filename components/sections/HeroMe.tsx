"use client";
// components/sections/HeroMe.tsx
// My character, cut out of his background so only he covers the name behind him: a see-through video (VP9 with alpha)
// where the browser shows it, an animated WebP on Safari (which draws VP9 alpha as black), and the still cutout first.
import { useEffect, useState } from "react";

export function HeroMe() {
  const [mode, setMode] = useState<"still" | "video" | "anim">("still");
  useEffect(() => {
    const ua = navigator.userAgent;
    const safari = /Safari/.test(ua) && !/Chrome|Chromium|CriOS|Edg|Android/.test(ua);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    setMode(safari ? "anim" : "video");
  }, []);
  const cls = "h-full w-auto max-w-none object-contain object-bottom";
  if (mode === "video")
    return <video className={cls} src="/images/me/hero-cut.webm" poster="/images/me/hero-cut.png" autoPlay muted loop playsInline aria-label="My 3D character, looking around" />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={cls} src={mode === "anim" ? "/images/me/hero-cut.webp" : "/images/me/hero-cut.png"} alt="My 3D character" />;
}
