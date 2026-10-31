"use client";
// components/three/footer/SocialHang.tsx
// The hanging 3D social icons at the top of the footer. Phones get the same icons hanging on CSS strings
// (they still swing when touched) so nothing heavy loads there.
import { useEffect, useRef, useState } from "react";
import { isLite } from "@/lib/lite";
import type { Social, SocialApi } from "./socialStage";

export function SocialHang({ items }: { items: Social[] }) {
  const box = useRef<HTMLDivElement>(null);
  const api = useRef<SocialApi | null>(null);
  const [mode, setMode] = useState<"pending" | "live" | "css">("pending");
  const [ready, setReady] = useState(false);
  const [swing, setSwing] = useState<number | null>(null);

  useEffect(() => setMode(isLite() ? "css" : "live"), []);
  useEffect(() => {
    const el = box.current;
    if (!el || mode !== "live") return;
    let token = 0;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !api.current) {
        const my = ++token;
        import("./socialStage").then(({ mountSocial }) => {
          if (my !== token) return;
          api.current = mountSocial(el, items, { onReady: () => setReady(true), onFail: () => setMode("css") });
        });
      } else if (!e.isIntersecting && api.current) {
        token++; api.current.dispose(); api.current = null; setReady(false);
      }
    }, { rootMargin: "20% 0px" });
    io.observe(el);
    return () => { token++; io.disconnect(); api.current?.dispose(); api.current = null; };
  }, [mode, items]);

  return (
    <div className="relative h-[200px] w-full sm:h-[230px]">
      {mode === "live" && <div ref={box} className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`} />}
      {(mode === "css" || (mode === "live" && !ready)) && (
        <div className={`absolute inset-0 ${mode === "live" ? "invisible" : ""}`}>
          <div className="absolute inset-x-0 top-6 h-[5px] rounded-full bg-gradient-to-b from-[#e6c483] via-[#b98f4a] to-[#8a6a32] shadow-[0_2px_4px_rgba(0,0,0,0.25)]" />
          <div className="absolute inset-x-0 top-[26px] flex justify-around px-2">
            {items.map((s, i) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                onTouchStart={() => setSwing(i)} onMouseEnter={() => setSwing(i)} onAnimationEnd={() => setSwing(null)}
                className={`flex origin-top flex-col items-center ${swing === i ? "animate-[hangswing_1.4s_ease-out]" : ""}`}
                style={{ paddingTop: 0 }}>
                <span className="block w-px bg-neutral-400" style={{ height: 40 + ((i * 37) % 5) * 9 }} />
                <span className="block h-2.5 w-2.5 -mt-0.5 rounded-full border-2 border-[#c9a15a]" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/models/footer/icon-${i}.webp`} alt="" className="-mt-0.5 h-12 w-12 rounded-[12px] shadow-[0_8px_16px_-6px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.3)] sm:h-14 sm:w-14" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
