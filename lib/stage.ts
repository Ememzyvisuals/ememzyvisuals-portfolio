"use client";
// Tiny shared store between the HTML page and the 3D stage.
import { useSyncExternalStore } from "react";

export type SceneKey = "home" | "work" | "models" | "games" | "about" | "certificates" | "blog" | "contact" | "none";
type S = {
  scene: SceneKey;
  progress: number; // 0..1, real: fonts, textures and shader compiles that the first screen needs
  entered: boolean; // visitor passed the loader
  scroll: number; // 0..1 page scroll
  focus: string | null; // e.g. hovered model slug
  letters: boolean; // 3D loader letters are on screen
  settled: boolean; // all loader letters have landed
};
let s: S = { scene: "none", progress: 0, entered: false, scroll: 0, focus: null, letters: false, settled: false };
const subs = new Set<() => void>();
export function setStage(p: Partial<S>) {
  let changed = false;
  for (const k in p) if ((s as Record<string, unknown>)[k] !== (p as Record<string, unknown>)[k]) changed = true;
  if (!changed) return;
  s = { ...s, ...p };
  subs.forEach((f) => f());
}
export const getStage = () => s;
if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") (window as unknown as { __ev: unknown }).__ev = { getStage, jobs: () => [...jobs.entries()] };
const sub = (f: () => void) => (subs.add(f), () => subs.delete(f));
export function useStage<T>(pick: (s: S) => T): T {
  return useSyncExternalStore(sub, () => pick(s), () => pick(s));
}

// Work the loader waits for. 3D moments that mount before the visitor enters register here
// and mark themselves done once their assets are loaded and shaders compiled.
const jobs = new Map<string, boolean>();
let assetShare = 1; // from the three.js loading manager, 0..1
function recompute() {
  if (s.entered) return;
  const n = jobs.size;
  const done = [...jobs.values()].filter(Boolean).length;
  const jobShare = n ? done / n : 0;
  setStage({ progress: Math.max(s.progress, n ? jobShare * 0.75 + assetShare * 0.25 : 0) });
}
export function track(key: string) {
  if (s.entered || jobs.has(key)) return;
  jobs.set(key, false);
  recompute();
}
export function finish(key: string) {
  if (!jobs.has(key)) return;
  jobs.set(key, true);
  recompute();
}
export function reportAssets(p: number) {
  assetShare = p;
  recompute();
}
