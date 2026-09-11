"use client";
// components/ui/GlassPanel.tsx
//
// Real WebGL liquid glass (refraction, chromatic aberration, specular
// highlights, elastic "liquid" feel) via liquid-glass-react — not just a
// CSS blur. Renders the plain `.liquid-glass` CSS utility on the server
// and until the client bundle mounts (so there's no flash of unstyled
// chrome and no SSR/hydration mismatch), then swaps to the real WebGL
// glass. On Safari/Firefox, where the library's displacement doesn't
// render, it automatically degrades to a frosted blur — no extra work
// needed here.

import dynamic from "next/dynamic";
import { useEffect, useState, type ComponentProps, type ReactNode } from "react";

const LiquidGlassImpl = dynamic(() => import("liquid-glass-react"), { ssr: false });

type LiquidGlassProps = ComponentProps<typeof LiquidGlassImpl>;

interface GlassPanelProps extends Partial<LiquidGlassProps> {
  children: ReactNode;
  /** Extra classes for the CSS fallback shown before the WebGL glass mounts. */
  fallbackClassName?: string;
}

export function GlassPanel({
  children,
  className = "",
  fallbackClassName = "",
  displacementScale = 64,
  blurAmount = 0.12,
  saturation = 150,
  aberrationIntensity = 1.5,
  elasticity = 0.12,
  cornerRadius = 24,
  overLight = true,
  ...rest
}: GlassPanelProps) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  if (!ready) {
    return (
      <div className={`liquid-glass ${fallbackClassName || className}`.trim()}>
        {children}
      </div>
    );
  }

  return (
    <LiquidGlassImpl
      className={className}
      displacementScale={displacementScale}
      blurAmount={blurAmount}
      saturation={saturation}
      aberrationIntensity={aberrationIntensity}
      elasticity={elasticity}
      cornerRadius={cornerRadius}
      overLight={overLight}
      {...rest}
    >
      {children}
    </LiquidGlassImpl>
  );
}
