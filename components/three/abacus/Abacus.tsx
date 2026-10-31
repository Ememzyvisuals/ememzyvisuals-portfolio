"use client";
// components/three/abacus/Abacus.tsx
// Lazy wrapper: builds the 3D abacus when it nears the screen and frees it when it leaves.
import { useEffect, useRef, useState } from "react";
import type { AbacusApi } from "./abacusStage";

export function Abacus() {
  const box = useRef<HTMLDivElement>(null);
  const api = useRef<AbacusApi | null>(null);
  const [state, setState] = useState<"idle" | "ready" | "failed">("idle");
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let token = 0;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !api.current) {
        const my = ++token;
        import("./abacusStage").then(({ mountAbacus }) => {
          if (my !== token) return;
          api.current = mountAbacus(el, { onReady: () => setState("ready"), onFail: () => setState("failed") });
        });
      } else if (!e.isIntersecting && api.current) {
        token++; api.current.dispose(); api.current = null; setState("idle");
      }
    }, { rootMargin: "30% 0px" });
    io.observe(el);
    return () => { token++; io.disconnect(); api.current?.dispose(); api.current = null; };
  }, []);
  return (
    <div className="relative aspect-square w-full sm:aspect-[16/10]">
      {state === "failed" && <div className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">3D is not available on this device.</div>}
      <div ref={box} className={`absolute inset-0 transition-opacity duration-1000 ${state === "ready" ? "opacity-100" : "opacity-0"}`} role="img" aria-label="A wooden abacus where each bead is a tool Emmanuel uses" />
    </div>
  );
}
