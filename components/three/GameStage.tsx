"use client";
// Lazy 3D preview for a game card: built only when the card comes near the screen, freed when it leaves.
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { GameScene } from "./gameStage";

export function GameStage({ kind, fallback, hint }: { kind: GameScene; fallback: ReactNode; hint: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "ready" | "failed">("idle");
  useEffect(() => {
    const el = box.current;
    if (!el) return;
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
  }, [kind]);
  return (
    <div className="absolute inset-0">
      {state !== "ready" && <div className="absolute inset-0">{fallback}</div>}
      <div ref={box} className={`absolute inset-0 transition-opacity duration-700 ${state === "ready" ? "opacity-100" : "opacity-0"}`} role="img" aria-label={hint} />
      {state === "ready" && (
        <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/45 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur">
          Tap to interact
        </span>
      )}
    </div>
  );
}
