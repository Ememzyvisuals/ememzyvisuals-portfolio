"use client";
// One source of truth for how much 3D we run.
// "full": glass, real lighting, all scenes. "lite": cheap materials, lower DPR. "off": no WebGL.
// We decide from explicit signals (reduced motion, Data Saver, slow network, WebGL support)
// plus measured frame time. We do not trust CPU core or memory counts; browsers clamp them.
import { useSyncExternalStore } from "react";

export type Quality = "full" | "lite" | "off";
type State = { quality: Quality; auto: Quality; override: Quality | null; ready: boolean; ceiling: Quality };

const KEY = "ev:quality";
const rank: Record<Quality, number> = { off: 0, lite: 1, full: 2 };
let state: State = { quality: "lite", auto: "lite", override: null, ready: false, ceiling: "full" };
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());

function webglOK() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

function detect(): Quality {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } };
  if (!webglOK()) return "off";
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return "off";
  if (nav.connection?.saveData) return "off";
  const et = nav.connection?.effectiveType;
  if (et === "slow-2g" || et === "2g") return "off";
  if (et === "3g") return "lite";
  const phone = matchMedia("(pointer: coarse)").matches && innerWidth < 900;
  return phone ? "lite" : "full";
}

function recompute() {
  const wanted = state.override ?? state.auto;
  const capped = rank[wanted] > rank[state.ceiling] && !state.override ? state.ceiling : wanted;
  state = { ...state, quality: capped };
}

export function initQuality() {
  if (state.ready || typeof window === "undefined") return;
  let override: Quality | null = null;
  try {
    const v = localStorage.getItem(KEY);
    if (v === "full" || v === "lite" || v === "off") override = v;
  } catch {}
  const q = new URLSearchParams(location.search).get("q");
  if (q === "full" || q === "lite" || q === "off") override = q;
  state = { ...state, auto: detect(), override, ready: true };
  recompute();
  emit();
}

export function setQuality(q: Quality | null) {
  state = { ...state, override: q, ceiling: "full" };
  try {
    if (q) localStorage.setItem(KEY, q);
    else localStorage.removeItem(KEY);
  } catch {}
  recompute();
  emit();
}

// Called by the stage when frames are slow. Never upgrades past a level that already failed.
export function stepDown() {
  if (state.override) return;
  const next: Quality = state.quality === "full" ? "lite" : state.quality;
  state = { ...state, ceiling: next, auto: next };
  recompute();
  emit();
}

const sub = (f: () => void) => (subs.add(f), () => subs.delete(f));
const snap = () => state;
const server = () => state;
export function useQuality() {
  return useSyncExternalStore(sub, snap, server);
}
