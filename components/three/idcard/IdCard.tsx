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
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [swing, setSwing] = useState<Record<string, number>>({});

  const wrap = useRef<HTMLDivElement>(null);
  const [ext, setExt] = useState(0);
  useEffect(() => setMode(isLite() ? "css" : "live"), []);
  // how far the card area is from the very top of the page: the straps start up there, off screen
  useEffect(() => {
    const m = () => wrap.current && setExt(Math.round(wrap.current.getBoundingClientRect().top + window.scrollY));
    m();
    window.addEventListener("resize", m);
    return () => window.removeEventListener("resize", m);
  }, []);
  useEffect(() => {
    const el = box.current;
    if (!el || mode !== "live" || !ext) return;
    let alive = true;
    import("./idStage").then(({ mountId }) => {
      if (!alive) return;
      api.current = mountId(el, { onReady: () => setReady(true), onFail: () => setMode("css") });
    });
    return () => { alive = false; api.current?.dispose(); api.current = null; };
  }, [mode, ext]);

  return (
    <div ref={wrap} className="relative mx-auto h-[560px] w-full max-w-sm md:mx-0 md:h-[640px]">
      {mode === "live" && (
        <div ref={box} data-ext={ext} style={{ top: -ext }} className={`absolute inset-x-0 bottom-0 z-0 transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`} role="img"
          aria-label="Emmanuel's two ID cards on lanyards: PlotWeaver, Machine Learning Engineer, and Axiveri, Founder." />
      )}
      {mode === "css" && (
        <div className="absolute inset-0 [perspective:900px]">
          {[
            { id: "ax", left: "43%", top: 0, rot: 5, z: 0, alt: "Axiveri ID card: Emmanuel Ariyo, Founder", strap: "#fc6401" },
            { id: "pw", left: "5%", top: 26, rot: -3, z: 1, alt: "PlotWeaver ID card: Emmanuel Ariyo, Machine Learning Engineer", strap: "#0e1a17" },
          ].map((c, i) => (
            <div key={c.id + (swing[c.id] ?? 0)} className="absolute flex origin-top flex-col items-center"
              style={{ left: c.left, top: c.top, zIndex: c.z, rotate: `${c.rot}deg`, animation: `${swing[c.id] ? "hangswing" : "iddrop"} 1.6s cubic-bezier(.3,1.4,.5,1) ${swing[c.id] ? 0 : i * 0.2}s both` }}>
              <div className="flex gap-4" style={{ marginTop: -(ext + c.top) }}>
                {[-1, 1].map((sd) => (
                  <span key={sd} className="relative block w-[18px] overflow-hidden shadow-[inset_0_2px_0_rgba(255,255,255,.18),2px_0_4px_rgba(0,0,0,.18)]"
                    style={{ height: 130 + ext + c.top, background: c.strap, transform: `rotate(${sd * 3}deg)`, transformOrigin: "bottom center" }}>
                    {/* the printed strap, turned to run down the ribbon */}
                    <span className="absolute left-0 top-0 block origin-top-left" style={{ width: 130 + ext + c.top, height: 18, transform: "rotate(90deg) translateY(-18px)",
                      backgroundImage: `url(/models/idcard/${c.id}-strap.webp)`, backgroundSize: "auto 100%", backgroundRepeat: "repeat-x" }} />
                  </span>
                ))}
              </div>
              <span className="-mt-1 block h-6 w-4 rounded-md bg-gradient-to-b from-[#f2f3f5] to-[#9ea3ab] shadow" />
              <button onClick={() => { setFlipped((v) => ({ ...v, [c.id]: !v[c.id] })); setSwing((v) => ({ ...v, [c.id]: (v[c.id] ?? 0) + 1 })); }}
                aria-label={`Flip the ${c.id === "pw" ? "PlotWeaver" : "Axiveri"} card`}
                className="relative -mt-1 h-[300px] w-[188px] [transform-style:preserve-3d] transition-transform duration-700 sm:h-[340px] sm:w-[214px]"
                style={{ transform: `rotateY(${flipped[c.id] ? 180 : 0}deg)` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/models/idcard/${c.id}-front-sm.webp`} alt={c.alt} className="absolute inset-0 h-full w-full rounded-[12px] shadow-[0_24px_40px_-18px_rgba(0,0,0,.5)] [backface-visibility:hidden]" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/models/idcard/${c.id}-back.webp`} alt="" aria-hidden loading="lazy" className="absolute inset-0 h-full w-full rounded-[12px] shadow-[0_24px_40px_-18px_rgba(0,0,0,.5)] [backface-visibility:hidden] [transform:rotateY(180deg)]" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
