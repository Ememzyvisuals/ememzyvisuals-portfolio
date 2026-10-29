"use client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useQuality } from "@/lib/quality";
import { setStage, useStage } from "@/lib/stage";

const WORD = "EMEMZYVISUALS";
const Letters3D = dynamic(() => import("./three/LoaderLetters"), { ssr: false });

// Phases: show -> leave -> gone. The 3D glass letters are drawn by the stage (LoaderScene)
// into this overlay's area. The HTML letters below are the no-3D version and the first paint.
export default function Loader() {
  const path = usePathname();
  const skip = path.startsWith("/admin") || path.startsWith("/light");
  const { quality, ready } = useQuality();
  const progress = useStage((s) => s.progress);
  const letters3d = useStage((s) => s.letters);
  const settled = useStage((s) => s.settled);
  const [phase, setPhase] = useState<"show" | "leave" | "gone">("show");
  const [shown, setShown] = useState(0);
  const start = useRef(0);
  const three = ready && quality !== "off";

  useEffect(() => {
    if (skip) {
      setStage({ entered: true });
      setPhase("gone");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    start.current = performance.now();
  }, []);

  // Real progress: 3D assets + shader compile when 3D is on, fonts when it is off.
  const [fonts, setFonts] = useState(false);
  useEffect(() => {
    document.fonts?.ready.then(() => setFonts(true));
  }, []);
  const target = !ready ? 0.04 : three ? progress : fonts ? 1 : 0.4;

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setShown((v) => {
        const n = v + (target - v) * 0.12;
        return Math.abs(target - n) < 0.002 ? target : n;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  const done = shown >= 0.999 && (!three || !letters3d || settled);
  useEffect(() => {
    if (phase !== "show") return;
    let seen = false;
    try { seen = sessionStorage.getItem("ev:seen") === "1"; } catch {}
    const minMs = seen ? 500 : 2100;
    const elapsed = performance.now() - start.current;
    if (done) {
      const t = setTimeout(() => leave(), Math.max(0, minMs - elapsed));
      return () => clearTimeout(t);
    }
    // Safety: never trap a visitor behind the loader.
    const t = setTimeout(() => leave(), 9000 - elapsed);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, phase]);

  function leave() {
    if (phase !== "show") return;
    try { sessionStorage.setItem("ev:seen", "1"); } catch {}
    setPhase("leave");
    setStage({ entered: true });
    const h = document.documentElement;
    h.classList.add("is-leaving");
    h.classList.remove("is-loading");
    setTimeout(() => {
      h.classList.remove("is-leaving");
      setPhase("gone");
    }, three ? 1150 : 600);
  }

  if (phase === "gone") return null;
  const pct = Math.round(shown * 100);

  return (
    <div
      className={`loader fixed inset-0 z-[60] flex flex-col items-center justify-center ${phase === "leave" ? "pointer-events-none" : ""} ${three ? "" : "bg-bg transition-opacity duration-500"} ${!three && phase === "leave" ? "opacity-0" : ""}`}
      role="status"
      aria-live="polite"
      aria-label={`Loading ${pct}%`}
    >
      {three && <Letters3D leaving={phase === "leave"} />}
      <div
        className={`flex select-none font-display font-extrabold tracking-tight text-[clamp(1.9rem,8.6vw,6.5rem)] leading-none transition-opacity duration-500 ${three && letters3d ? "opacity-0" : "opacity-100"}`}
        aria-hidden
      >
        {WORD.split("").map((ch, i) => (
          <span
            key={i}
            className="loader-letter inline-block"
            style={{
              animationDelay: `${i * 70}ms`,
              backgroundImage: `linear-gradient(90deg, hsl(var(--fg)) ${Math.max(0, shown * 100 * 1.15 - i * (100 / WORD.length))}%, hsl(var(--fg) / 0.18) 0)`,
            }}
          >
            {ch}
          </span>
        ))}
      </div>
      <div className={`absolute bottom-10 flex flex-col items-center gap-3 transition-opacity duration-300 sm:bottom-14 ${phase === "leave" ? "opacity-0" : ""}`}>
        <div className="font-display text-sm font-semibold tabular-nums text-muted">{pct}%</div>
        <div className="h-[2px] w-40 overflow-hidden rounded-full bg-fg/10">
          <div className="h-full bg-fg transition-[width] duration-200" style={{ width: `${pct}%` }} />
        </div>
        <button onClick={leave} className="mt-2 text-xs font-medium text-muted underline-offset-4 hover:text-fg hover:underline">
          Skip intro
        </button>
      </div>
    </div>
  );
}
