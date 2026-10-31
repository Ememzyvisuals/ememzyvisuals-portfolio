"use client";
// components/three/chess/ChessBoard.tsx
// Lazy wrapper for the chess stack: builds the 3D board when it nears the screen and shows the piece card.
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import type { ChessApi } from "./chessStage";

export function ChessBoard() {
  const box = useRef<HTMLDivElement>(null);
  const api = useRef<ChessApi | null>(null);
  const { resolvedTheme } = useTheme();
  const [state, setState] = useState<"idle" | "ready" | "failed">("idle");
    
  useEffect(() => {
    const el = box.current;
    if (!el) return;
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
  }, [resolvedTheme]);

  return (
    <div className="relative">
      <div className="relative aspect-[4/5] w-full sm:aspect-[16/10]">
        {state !== "ready" && (
          <div className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">
            {state === "failed" ? "3D is not available on this device. The full list is below." : ""}
          </div>
        )}
        <div ref={box} className={`absolute inset-0 transition-opacity duration-1000 ${state === "ready" ? "opacity-100" : "opacity-0"}`} role="img" aria-label="A wooden chess set where each piece is a tool Emmanuel uses" />
      </div>
    </div>
  );
}
