"use client";
// components/three/earth/Globe.tsx
// The Contact page Earth. Phones get one rendered frame as an image; the paper plane still lands on it.
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { isLite } from "@/lib/lite";
import type { GlobeApi } from "./globeStage";

// African countries as named in Natural Earth
const AFRICA = new Set(["Algeria","Angola","Benin","Botswana","Burkina Faso","Burundi","Cameroon","Central African Rep.","Chad","Congo","Dem. Rep. Congo","Côte d'Ivoire","Djibouti","Egypt","Eq. Guinea","Eritrea","eSwatini","Ethiopia","Gabon","Gambia","Ghana","Guinea","Guinea-Bissau","Kenya","Lesotho","Liberia","Libya","Madagascar","Malawi","Mali","Mauritania","Morocco","Mozambique","Namibia","Niger","Nigeria","Rwanda","Senegal","Sierra Leone","Somalia","Somaliland","South Africa","S. Sudan","Sudan","Tanzania","Togo","Tunisia","Uganda","W. Sahara","Zambia","Zimbabwe"]);

export function Globe({ className = "" }: { className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const api = useRef<GlobeApi | null>(null);
  const { resolvedTheme } = useTheme();
  const [lite, setLite] = useState<boolean | null>(null);
  const [still, setStill] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [pulse, setPulse] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  useEffect(() => setLite(isLite()), []);
  useEffect(() => {
    const on = () => setPulse((n) => n + 1);
    window.addEventListener("globe:arrive", on);
    return () => window.removeEventListener("globe:arrive", on);
  }, []);

  useEffect(() => {
    const el = box.current;
    if (!el || lite === null) return;
    let alive = true;
    import("./globeStage").then(({ mountGlobe }) => {
      if (!alive) return;
      api.current = mountGlobe(el, {
        still: lite, dark: resolvedTheme === "dark",
        onReady: () => setReady(true), onFail: () => setReady(false), onPick: setPicked,
        onStill: (url) => { setStill(url); queueMicrotask(() => { api.current?.dispose(); api.current = null; }); },
      });
    });
    return () => { alive = false; api.current?.dispose(); api.current = null; };
  }, [lite, resolvedTheme]);

  return (
    <div data-globe className={`relative ${className}`} role="img" aria-label="The Earth with Nigeria facing you, marked with an orange pin">
      {still && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={still} alt="" aria-hidden className="absolute inset-0 h-full w-full object-contain" />
          {/* the pin pulse when a plane lands, drawn over the still picture */}
          <span key={pulse} className="pointer-events-none absolute left-1/2 top-[44%] block h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fc6401] [animation:globepulse_1.2s_ease-out]" />
        </>
      )}
      <div ref={box} className={`absolute inset-0 transition-opacity duration-700 ${ready && !lite ? "opacity-100" : "opacity-0"}`} />
      {picked && (
        <div className="card-surface absolute left-1/2 top-full z-10 mt-1 w-[min(20rem,90%)] -translate-x-1/2 p-4 text-center">
          <p className="font-display text-lg font-extrabold tracking-tight text-foreground">{picked}</p>
          <p className="mt-1 text-sm leading-snug text-foreground/70">
            {picked === "Nigeria" ? "Home. Where I build speech AI for African languages." : AFRICA.has(picked) ? "One of the African countries whose languages this work is for." : "Happy to work with teams here."}
          </p>
        </div>
      )}
    </div>
  );
}
