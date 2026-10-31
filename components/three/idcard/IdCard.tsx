"use client";
// components/three/idcard/IdCard.tsx
// The lanyard ID card on the About page. Phones get the same card on a CSS strap: it drops in,
// swings when touched and flips over when tapped, with nothing heavy to load.
import { useEffect, useRef, useState } from "react";
import { isLite } from "@/lib/lite";
import type { IdApi } from "./idStage";

export function IdCard() {
  const box = useRef<HTMLDivElement>(null);
  const api = useRef<IdApi | null>(null);
  const [mode, setMode] = useState<"pending" | "live" | "css">("pending");
  const [ready, setReady] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [swing, setSwing] = useState(0);

  useEffect(() => setMode(isLite() ? "css" : "live"), []);
  useEffect(() => {
    const el = box.current;
    if (!el || mode !== "live") return;
    let alive = true;
    import("./idStage").then(({ mountId }) => {
      if (!alive) return;
      api.current = mountId(el, { onReady: () => setReady(true), onFail: () => setMode("css") });
    });
    return () => { alive = false; api.current?.dispose(); api.current = null; };
  }, [mode]);

  return (
    <div className="relative mx-auto h-[560px] w-full max-w-sm md:mx-0 md:h-[640px]">
      {mode === "live" && (
        <div ref={box} className={`absolute inset-0 transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`} role="img"
          aria-label="Emmanuel's Axiveri ID card hanging on a lanyard. Drag it, flick it to spin, tap it to flip." />
      )}
      {mode === "css" && (
        <div className="absolute inset-x-0 top-0 flex justify-center [perspective:900px]">
          <div key={swing} className="flex origin-top animate-[iddrop_1.6s_cubic-bezier(.3,1.4,.5,1)] flex-col items-center" style={{ animationName: swing ? "hangswing" : "iddrop" }}>
            <div className="flex gap-6">
              <span className="block h-[150px] w-[18px] -rotate-6 rounded-sm bg-[#1f3fd6] shadow-[inset_0_2px_0_rgba(255,255,255,.2)]" />
              <span className="block h-[150px] w-[18px] rotate-6 rounded-sm bg-[#1f3fd6] shadow-[inset_0_2px_0_rgba(255,255,255,.2)]" />
            </div>
            <span className="-mt-1 block h-6 w-4 rounded-md bg-gradient-to-b from-[#f2f3f5] to-[#9ea3ab] shadow" />
            <button onClick={() => { setFlipped((v) => !v); setSwing((n) => n + 1); }} aria-label="Flip the ID card"
              className="relative -mt-1 h-[358px] w-[225px] [transform-style:preserve-3d] transition-transform duration-700"
              style={{ transform: `rotateY(${flipped ? 180 : 0}deg)` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/models/idcard/front-sm.webp" alt="Emmanuel Ariyo, Machine Learning Engineer and founder of Axiveri"
                className="absolute inset-0 h-full w-full rounded-[14px] shadow-[0_24px_40px_-18px_rgba(0,0,0,.45)] [backface-visibility:hidden]" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/models/idcard/back.webp" alt="" aria-hidden
                className="absolute inset-0 h-full w-full rounded-[14px] shadow-[0_24px_40px_-18px_rgba(0,0,0,.45)] [backface-visibility:hidden] [transform:rotateY(180deg)]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
