"use client";
// components/three/Hero3D.tsx
//
// Mounts the 3D hero figure behind the hero text. Fully visible/sharp on
// first load (the intended "this is what you see first" impression), then
// fades toward a subtle background presence as the page scrolls past the
// hero — same behavior on mobile and desktop.
//
// Also checks the Network Information API (where supported) and skips
// mounting the 3D canvas entirely on slow/data-saver connections, so it
// never hurts responsiveness for someone on a poor connection. Browsers
// without the API (e.g. Safari) just get the 3D experience by default —
// this is a progressive enhancement, not a hard requirement.

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

const Canvas = dynamic(() => import("@react-three/fiber").then((m) => m.Canvas), {
  ssr: false,
});
const HeroFigureLazy = dynamic(
  () => import("./HeroFigure").then((m) => m.HeroFigure),
  { ssr: false }
);

function useGoodConnection() {
  const [ok, setOk] = useState(true);
  useEffect(() => {
    const nav = navigator as Navigator & {
      connection?: { effectiveType?: string; saveData?: boolean };
    };
    const conn = nav.connection;
    if (!conn) return; // API unsupported — assume good connection
    const slow = conn.saveData || ["slow-2g", "2g", "3g"].includes(conn.effectiveType || "");
    setOk(!slow);
  }, []);
  return ok;
}

export function Hero3D() {
  const goodConnection = useGoodConnection();
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    function handleScroll() {
      const heroHeight = window.innerHeight;
      const progress = Math.min(1, Math.max(0, window.scrollY / heroHeight));
      // Fully visible at the top, easing down to a subtle background
      // presence by the time the hero has scrolled out of view.
      setOpacity(1 - progress * 0.75);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!goodConnection) return null;

  return (
    <div
      className="block absolute inset-0 z-0"
      style={{ opacity }}
      aria-hidden="true"
    >
      <ErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <Canvas
            dpr={[1, 1.5]}
            camera={{ position: [0, 0.4, 4.2], fov: 35 }}
            gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
            style={{ background: "transparent" }}
          >
            <Suspense fallback={null}>
              <HeroFigureLazy />
            </Suspense>
          </Canvas>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
