"use client";
// Lazy 3D preview for a game card: built only when the card comes near the screen, freed when it leaves.
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { GameScene } from "./gameStage";
import { isLite } from "@/lib/lite";

export function GameStage({ kind, fallback, hint }: { kind: GameScene; fallback: ReactNode; hint: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "ready" | "failed">("idle");
  // on phones the scene stays a still picture until it is tapped
  const [armed, setArmed] = useState(false);
  useEffect(() => setArmed(!isLite()), []);
  useEffect(() => {
    const el = box.current;
    if (!el || !armed) return;
    let stop: (() => void) | null = null, token = 0;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !stop) {
        const my = ++token;
        let cleanup = () => {};
        stop = () => { token++; cleanup(); stop = null; };
        import("./gameStage").then(({ mountGame }) => {
          if (my !== token) return;
          cleanup = mountGame(el, kind, () => my === token && setState("ready"), () => { stop?.(); setState("failed"); });
        });
      } else if (!e.isIntersecting && stop) { stop(); setState("idle"); }
    }, { rootMargin: "40% 0px" });
    io.observe(el);
    return () => { io.disconnect(); stop?.(); };
  }, [kind, armed]);
  return (
    <div className="absolute inset-0">
      {state !== "ready" && (
        <div className="absolute inset-0" onClick={() => setArmed(true)}>
          {state === "failed" ? fallback : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`/stills/game-${kind}.webp`} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" onError={(e) => ((e.currentTarget.style.display = "none"))} />
          )}
        </div>
      )}
      <div ref={box} data-kind={kind} className={`absolute inset-0 transition-opacity duration-700 ${state === "ready" ? "opacity-100" : "pointer-events-none opacity-0"}`} role="img" aria-label={hint} />
      {state === "ready" && (
        <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/45 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur">
          Tap to interact
        </span>
      )}
    </div>
  );
}
