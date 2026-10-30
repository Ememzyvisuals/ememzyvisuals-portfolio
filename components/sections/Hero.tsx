"use client";
// components/sections/Hero.tsx
// Scroll story over the 3D desk scene: the scene stays pinned while the camera moves round him and the
// headline, role and buttons come in one after another.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { VisitorCounter } from "@/components/ui/VisitorCounter";

type Stage = { setMode: (m: "light" | "dark") => void; setProgress: (p: number) => void; dispose: () => void };

const clamp = (v: number) => Math.min(1, Math.max(0, v));
// 0 at a, 1 at b
const band = (p: number, a: number, b: number) => clamp((p - a) / (b - a));

export function Hero() {
  const wrap = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useRef<Stage | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [p, setP] = useState(0);
  const { resolvedTheme } = useTheme();
  const mode = resolvedTheme === "dark" ? "dark" : "light";

  // start the 3D scene once the page is idle, so text and layout come first on slow networks
  useEffect(() => {
    let alive = true;
    const start = () => {
      if (!alive || !canvas.current) return;
      const mobile = window.matchMedia("(max-width: 768px)").matches;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      import("@/components/three/deskStage").then(({ mountDesk }) => {
        if (!alive || !canvas.current) return;
        stage.current = mountDesk(canvas.current, {
          mobile,
          mode,
          onReady: () => alive && setReady(true),
          onFail: () => alive && setFailed(true),
        });
        if (reduce) stage.current.setProgress(0);
      });
    };
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(start, { timeout: 1500 });
    else setTimeout(start, 300);
    return () => {
      alive = false;
      stage.current?.dispose();
      stage.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => stage.current?.setMode(mode), [mode]);

  // scroll progress through the pinned hero
  useEffect(() => {
    const onScroll = () => {
      const el = wrap.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const v = clamp(-el.getBoundingClientRect().top / Math.max(1, total));
      setP(v);
      stage.current?.setProgress(v);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const a = band(p, 0.0, 0.12);      // name holds, then lifts away
  const name = 1 - band(p, 0.12, 0.24);
  const role = band(p, 0.26, 0.38) * (1 - band(p, 0.58, 0.68));
  const cta = band(p, 0.68, 0.8);

  return (
    <section ref={wrap} className="relative" style={{ height: "320vh" }} aria-label="Introduction">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* still image while the scene downloads, and the fallback without WebGL */}
        <div
          className="absolute inset-0 bg-center bg-cover transition-opacity duration-700"
          style={{
            backgroundImage: "url(/models/hero/poster-light.webp)",
            opacity: ready ? 0 : 1,
            filter: mode === "dark" ? "brightness(.35) saturate(1.2)" : undefined,
          }}
          aria-hidden
        />
        {!failed && (
          <canvas
            ref={canvas}
            className="absolute inset-0 h-full w-full transition-opacity duration-700"
            style={{ opacity: ready ? 1 : 0 }}
            aria-hidden
          />
        )}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background/70 to-transparent" />

        {/* 1. the name */}
        <div
          className="absolute inset-x-0 top-[13%] px-5 text-center lg:inset-x-auto lg:left-[6%] lg:top-[30%] lg:max-w-[46%] lg:text-left"
          style={{ opacity: name, transform: `translateY(${(1 - name) * -40 + a * -10}px)` }}
        >
          <h1
            className="font-extrabold text-foreground"
            style={{ fontSize: "clamp(2.6rem, 9vw, 6.2rem)", lineHeight: 1.02, letterSpacing: "-0.045em" }}
          >
            Hi. I&apos;m Emmanuel.
          </h1>
          <p className="mt-3 text-sm md:text-base text-muted-foreground">Scroll to step into my workspace</p>
        </div>

        {/* 2. the role */}
        <div
          className="absolute inset-x-4 bottom-[6%] mx-auto max-w-xl liquid-glass rounded-3xl px-6 py-6 md:px-10 md:py-8 text-center lg:inset-x-auto lg:bottom-auto lg:left-[6%] lg:top-[28%] lg:max-w-[40%] lg:text-left"
          style={{ opacity: role, transform: `translateY(${(1 - role) * 30}px)` }}
          aria-hidden={role < 0.05}
        >
          <h2
            className="font-extrabold text-foreground"
            style={{ fontSize: "clamp(2rem, 7vw, 5rem)", lineHeight: 1.05, letterSpacing: "-0.04em" }}
          >
            Creative Dev &amp; AI Engineer.
          </h2>
          <p className="mx-auto lg:mx-0 mt-4 max-w-md text-base md:text-lg text-muted-foreground leading-relaxed">
            Building scalable web applications, AI systems, and open-source African language models that solve
            real problems.
          </p>
        </div>

        {/* 3. founder tag and actions */}
        <div
          className="absolute inset-x-0 bottom-[8%] px-5 flex flex-col items-center gap-4 lg:inset-x-auto lg:left-[6%] lg:bottom-auto lg:top-[38%] lg:items-start"
          style={{ opacity: cta, transform: `translateY(${(1 - cta) * 30}px)`, pointerEvents: cta > 0.5 ? "auto" : "none" }}
        >
          <Link
            href="/axiveri"
            className="liquid-glass inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-xs font-bold uppercase tracking-widest text-foreground"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Founder of Axiveri
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-10 py-4 rounded-2xl bg-foreground text-background font-bold text-base hover:opacity-85 transition-opacity"
          >
            Get In Touch
          </Link>
          <VisitorCounter />
        </div>
      </div>
    </section>
  );
}
