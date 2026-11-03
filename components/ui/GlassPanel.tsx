// components/ui/GlassPanel.tsx
// A panel in the site's `.liquid-glass` CSS glass (SVG distortion + backdrop blur, frosted fallback on Safari).
// The WebGL glass library this used to wrap drew a broken full-viewport canvas in production and was always
// switched off, so the panel is now plain CSS. Older props are still accepted so existing call sites keep working.
import type { ReactNode } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  /** Classes used instead of `liquid-glass ${className}` when given. */
  fallbackClassName?: string;
  [legacy: string]: unknown;
}

export function GlassPanel({ children, className = "", fallbackClassName = "" }: GlassPanelProps) {
  return <div className={fallbackClassName || `liquid-glass ${className}`.trim()}>{children}</div>;
}
