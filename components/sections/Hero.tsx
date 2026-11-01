"use client";
// components/sections/Hero.tsx
// Scroll story over the 3D desk scene: the scene stays pinned while the camera moves round him and the
// headline, role and buttons come in one after another.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { VisitorCounter } from "@/components/ui/VisitorCounter";
import { isLite } from "@/lib/lite";

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
  // phones get three still frames of the same scene instead of the live 3D room
  const [lite, setLite] = useState(false);
  const { resolvedTheme } = useTheme();
  const mode = resolvedTheme === "dark" ? "dark" : "light";

  // start the 3D scene once the page is idle, so text and layout come first on slow networks
  useEffect(() => {
    let alive = true;
    if (isLite()) { setLite(true); return; }
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
      setP((old) => (Math.abs(old - v) < 0.002 ? old : v));
      stage.current?.setProgress(v);
    };
    let queued = 0;
    const onFrame = () => { queued = 0; onScroll(); };
    const onEvent = () => { if (!queued) queued = requestAnimationFrame(onFrame); };
    onScroll();
    window.addEventListener("scroll", onEvent, { passive: true });
    return () => { window.removeEventListener("scroll", onEvent); cancelAnimationFrame(queued); };
  }, []);

  const a = band(p, 0.0, 0.12);      // name holds, then lifts away
  const name = 1 - band(p, 0.12, 0.24);
  const role = band(p, 0.26, 0.38) * (1 - band(p, 0.58, 0.68));
  const cta = band(p, 0.68, 0.8);

  return (
    <section ref={wrap} className="relative" style={{ height: lite ? "240vh" : "320vh" }} aria-label="Introduction">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* still image while the scene downloads, and the fallback without WebGL */}
        <div
          className="absolute inset-0 bg-center bg-cover transition-opacity duration-700"
          style={{
            backgroundImage: "url(/models/hero/poster-light.webp)",
            opacity: ready || lite ? 0 : 1,
            filter: mode === "dark" ? "brightness(.35) saturate(1.2)" : undefined,
          }}
          aria-hidden
        />
        {lite && [0, 1, 2].map((i) => {
          const o = i === 0 ? 1 : i === 1 ? band(p, 0.22, 0.34) : band(p, 0.62, 0.74);
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={`/stills/hero-${mode}-${i}.webp`} alt="" aria-hidden fetchPriority={i === 0 ? "high" : "low"} loading={i === 0 ? "eager" : "lazy"} decoding="async"
              className="absolute inset-0 h-full w-full object-cover" style={{ opacity: o }} />
          );
        })}
        {!failed && !lite && (
          <canvas
            ref={canvas}
            className="absolute inset-0 h-full w-full transition-opacity duration-700"
            style={{ opacity: ready ? 1 : 0 }}
            aria-hidden
          />
        )}
        {/* scroll position marker on the left */}
        <div className="absolute left-4 md:left-[4%] top-1/2 -translate-y-1/2 flex flex-col gap-3" aria-hidden>
          {[0, 1, 2].map((i) => {
            const on = (i === 0 && name > 0.5) || (i === 1 && role > 0.5) || (i === 2 && cta > 0.5);
            return (
              <span
                key={i}
                className="block h-px transition-all duration-500"
                style={{ width: on ? 28 : 6, background: "currentColor", opacity: on ? 1 : 0.35 }}
              />
            );
          })}
        </div>

        {/* 1. the name */}
        <div
          className="absolute inset-x-0 top-[14%] px-8 md:inset-x-auto md:left-[20%] md:top-[30%] lg:left-[20%] md:max-w-[42%]"
          style={{ opacity: name, transform: `translateY(${(1 - name) * -40 + a * -10}px)` }}
        >
          <h1 className="font-anton museum-shadow uppercase text-foreground" style={{ fontWeight: 400, fontSize: "clamp(4rem, 12vw, 10rem)", lineHeight: 0.88, letterSpacing: "0" }}>
            Hi, I&apos;m
            <br />
            Emmanuel
          </h1>
          <p className="museum-shadow mt-5 max-w-[19rem] text-[13px] md:text-sm leading-relaxed font-medium text-foreground">
            Machine learning engineer and full-stack developer from Nigeria, building speech and language AI for
            African languages. Scroll to step into my workspace.
          </p>
        </div>

        {/* 2. the role */}
        <div
          className="absolute inset-x-0 bottom-[9%] px-8 md:inset-x-auto md:bottom-auto md:left-[20%] md:top-[28%] md:max-w-[46%]"
          style={{ opacity: role, transform: `translateY(${(1 - role) * 30}px)` }}
          aria-hidden={role < 0.05}
        >
          <h2 className="font-museum museum-shadow text-foreground" style={{ fontSize: "clamp(2.7rem, 7vw, 6rem)" }}>
            Creative developer
            <br />
            &amp; AI engineer
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-6 max-w-md">
            <p className="museum-shadow text-[12.5px] md:text-[13px] leading-relaxed font-medium text-foreground">
              Scalable web applications and AI systems, from the first commit to production.
            </p>
            <p className="museum-shadow text-[12.5px] md:text-[13px] leading-relaxed font-medium text-foreground">
              Open-source African language models: speech recognition, text to speech and translation.
            </p>
          </div>
        </div>

        {/* 3. founder tag and actions */}
        <div
          className="absolute inset-x-0 bottom-[8%] px-8 flex flex-col items-start gap-5 md:inset-x-auto md:left-[20%] md:bottom-auto md:top-[30%]"
          style={{ opacity: cta, transform: `translateY(${(1 - cta) * 30}px)`, pointerEvents: cta > 0.5 ? "auto" : "none" }}
        >
          <h2 className="font-anton museum-shadow uppercase text-foreground" style={{ fontWeight: 400, fontSize: "clamp(3.2rem, 9vw, 8rem)", lineHeight: 0.9, letterSpacing: "0" }}>
            Let&apos;s build
            <br />
            something real
          </h2>
          <Link
            href="/axiveri"
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground hover:text-foreground"
          >
            Founder of Axiveri
          </Link>
          <div className="flex items-center gap-5">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-foreground text-background text-sm font-semibold tracking-wide hover:opacity-85 transition-opacity"
            >
              Get In Touch
            </Link>
            <VisitorCounter />
          </div>
        </div>
      </div>
    </section>
  );
}
