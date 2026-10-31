"use client";
// components/three/chess/ChessBoard.tsx
// Lazy wrapper for the chess stack: builds the 3D board when it nears the screen and shows the piece card.
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import type { ChessApi } from "./chessStage";
import { isLite } from "@/lib/lite";

export function ChessBoard() {
  const box = useRef<HTMLDivElement>(null);
  const api = useRef<ChessApi | null>(null);
  const { resolvedTheme } = useTheme();
  const [state, setState] = useState<"idle" | "ready" | "failed">("idle");
  // phones see a still render until they tap the board
  const [armed, setArmed] = useState(false);
  useEffect(() => setArmed(!isLite()), []);
    
  useEffect(() => {
    const el = box.current;
    if (!el || !armed) return;
    let token = 0;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !api.current) {
        const my = ++token;
        import("./chessStage").then(({ mountChess }) => {
          if (my !== token) return;
          api.current = mountChess(el, {
            dark: resolvedTheme === "dark",
            onInfo: () => {}, onStatus: () => {},
            onReady: () => setState("ready"), onFail: () => setState("failed"),
          });
        });
      } else if (!e.isIntersecting && api.current) {
        token++; api.current.dispose(); api.current = null; setState("idle");
      }
    }, { rootMargin: "30% 0px" });
    io.observe(el);
    return () => { token++; io.disconnect(); api.current?.dispose(); api.current = null; };
  }, [resolvedTheme, armed]);

  return (
    <div className="relative">
      <div className="relative aspect-[4/5] w-full sm:aspect-[16/10]">
        {state !== "ready" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/stills/chess.webp" alt="A wooden chess set where each piece carries the logo of a tool Emmanuel uses"
            className="absolute inset-0 h-full w-full object-contain" loading="lazy" decoding="async" onClick={() => setArmed(true)} />
        )}
        <div ref={box} className={`absolute inset-0 transition-opacity duration-1000 ${state === "ready" ? "opacity-100" : "pointer-events-none opacity-0"}`} role="img" aria-label="A wooden chess set where each piece is a tool Emmanuel uses" />
      </div>
    </div>
  );
}
