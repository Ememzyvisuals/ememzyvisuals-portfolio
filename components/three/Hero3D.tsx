"use client";
// components/three/Hero3D.tsx
//
// Mounts the 3D hero figure behind the hero text. Deliberately paranoid
// about safety after the liquid-glass-react incident: client-only via
// next/dynamic, Suspense fallback so nothing blocks render, and wrapped
// in our own ErrorBoundary so any WebGL/model failure just silently
// renders nothing instead of crashing the page.

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

const Canvas = dynamic(() => import("@react-three/fiber").then((m) => m.Canvas), {
  ssr: false,
});
const HeroFigureLazy = dynamic(
  () => import("./HeroFigure").then((m) => m.HeroFigure),
  { ssr: false }
);

export function Hero3D() {
  return (
    <div
      className="hidden sm:block pointer-events-none absolute inset-0 z-0 opacity-[0.16] dark:opacity-[0.22]"
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
