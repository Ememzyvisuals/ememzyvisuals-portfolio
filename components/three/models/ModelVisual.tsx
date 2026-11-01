"use client";
// components/three/models/ModelVisual.tsx
// Lazy wrapper for a model's 3D piece. Phones get one rendered frame as an image (GPU freed straight away);
// tapping it plays the live version.
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { isLite } from "@/lib/lite";
import type { ModelApi, ModelKind } from "./modelStage";

export function ModelVisual({ kind, label, className = "", onBrand = false, mono = false }: { kind: ModelKind; label: string; className?: string; onBrand?: boolean; mono?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const api = useRef<ModelApi | null>(null);
  const { resolvedTheme } = useTheme();
  const [lite, setLite] = useState<boolean | null>(null);
  const [live, setLive] = useState(false);
  const [still, setStill] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => setLite(isLite()), []);

  useEffect(() => {
    const el = box.current;
    if (!el || lite === null) return;
    const wantStill = lite && !live;
    let token = 0;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !api.current) {
        const my = ++token;
        import("./modelStage").then(({ mountModel }) => {
          if (my !== token) return;
          api.current = mountModel(el, kind, {
            still: wantStill, dark: resolvedTheme === "dark", onBrand, mono,
            onReady: () => setReady(true), onFail: () => setReady(false),
            onStill: (url) => { setStill(url); queueMicrotask(() => { api.current?.dispose(); api.current = null; }); },
          });
        });
      } else if (!e.isIntersecting && api.current && !wantStill) {
        token++; api.current.dispose(); api.current = null; setReady(false);
      }
    }, { rootMargin: "25% 0px" });
    io.observe(el);
    return () => { token++; io.disconnect(); api.current?.dispose(); api.current = null; };
  }, [kind, lite, live, resolvedTheme, onBrand]);

  return (
    <div className={`relative ${className}`} role="img" aria-label={label}>
      {still && !live && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={still} alt="" aria-hidden onClick={() => setLive(true)} className="absolute inset-0 h-full w-full object-contain" />
      )}
      <div ref={box} className={`absolute inset-0 transition-opacity duration-700 ${ready && (!lite || live) ? "opacity-100" : "opacity-0"} ${lite && !live ? "pointer-events-none" : ""}`} />
    </div>
  );
}
