"use client";
// components/three/chess/ChessBoard.tsx
// Lazy wrapper for the chess stack: builds the 3D board when it nears the screen and shows the piece card.
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import type { ChessApi, PieceInfo } from "./chessStage";
import { KIND_NAME } from "./pieces";

export function ChessBoard() {
  const box = useRef<HTMLDivElement>(null);
  const api = useRef<ChessApi | null>(null);
  const { resolvedTheme } = useTheme();
  const [state, setState] = useState<"idle" | "ready" | "failed">("idle");
  const [info, setInfo] = useState<PieceInfo>(null);
  
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
            onInfo: setInfo, onStatus: () => {},
            onReady: () => setState("ready"), onFail: () => setState("failed"),
          });
        });
      } else if (!e.isIntersecting && api.current) {
        token++; api.current.dispose(); api.current = null; setState("idle"); setInfo(null);
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

      {state === "ready" && (
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-1 sm:p-2">
          <div className={`card-surface pointer-events-auto max-w-[17rem] p-4 transition-all duration-300 ${info ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"}`}>
            {info && (
              <>
                <p className="text-[11px] font-medium text-muted-foreground">{info.white ? "White" : "Black"} {KIND_NAME[info.kind]}</p>
                <p className="mt-1 font-display text-xl font-extrabold tracking-tight text-foreground">{info.tech.name}</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-foreground/75">{info.tech.use}</p>
                <p className="mt-2 text-[12px] text-muted-foreground">Used in {info.tech.seen}</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
