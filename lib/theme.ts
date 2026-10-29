"use client";
import { useSyncExternalStore } from "react";
import { useQuality } from "./quality";

function sub(f: () => void) {
  const mo = new MutationObserver(f);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => mo.disconnect();
}
export function useDark() {
  return useSyncExternalStore(
    sub,
    () => document.documentElement.classList.contains("dark"),
    () => false,
  );
}

// True when 3D moments should mount.
export function useThreeOn() {
  const { quality, ready } = useQuality();
  return ready && quality !== "off";
}
