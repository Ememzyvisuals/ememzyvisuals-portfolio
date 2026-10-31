// lib/lite.ts
// Phones, small screens, slow or data-saving connections and low-memory devices get the light site:
// still renders of every 3D scene instead of live WebGL. A scene only goes live when the visitor taps it.
// Add ?full=1 to the address to force the full 3D (used to render the stills).
export function isLite(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const q = new URLSearchParams(window.location.search);
    if (q.get("full") === "1") return false;
    if (q.get("lite") === "1") return true;
  } catch {}
  const n = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean; effectiveType?: string } };
  if (window.matchMedia("(max-width: 768px)").matches) return true;
  if (n.connection?.saveData) return true;
  if (n.connection?.effectiveType && /(^|-)2g|3g/.test(n.connection.effectiveType)) return true;
  if (n.deviceMemory && n.deviceMemory <= 4) return true;
  return false;
}
