"use client";
// One WebGL canvas for the whole site. Every 3D moment is a drei <View> that draws into
// the area of its DOM element, so we never create a second WebGL context.
import { Canvas, useFrame } from "@react-three/fiber";
import { View, useProgress } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { stepDown, useQuality } from "@/lib/quality";
import { getStage, reportAssets } from "@/lib/stage";

function Progress() {
  const { active, loaded, total, progress } = useProgress();
  useEffect(() => {
    reportAssets(total === 0 || (!active && loaded >= total) ? 1 : progress / 100);
  }, [active, loaded, total, progress]);
  return null;
}

// Watches real frame times. If the device struggles on "full", drop to "lite" for this visit.
function Monitor() {
  const { quality } = useQuality();
  const samples = useRef<number[]>([]);
  const bad = useRef(0);
  const t0 = useRef(performance.now());
  useFrame((_, dt) => {
    if (quality !== "full" || !getStage().entered || document.hidden) return;
    samples.current.push(dt * 1000);
    if (performance.now() - t0.current < 2000) return;
    const arr = samples.current.sort((a, b) => a - b);
    const mean = arr.reduce((a, b) => a + b, 0) / Math.max(1, arr.length);
    const p95 = arr[Math.floor(arr.length * 0.95)] ?? mean;
    samples.current = [];
    t0.current = performance.now();
    if (mean > 26 || p95 > 45) bad.current++;
    else bad.current = 0;
    if (bad.current >= 2 || mean > 40) stepDown();
  });
  return null;
}

export default function Stage() {
  const { quality } = useQuality();
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const f = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", f);
    return () => document.removeEventListener("visibilitychange", f);
  }, []);
  const ratio = typeof window === "undefined" ? 1 : window.devicePixelRatio || 1;
  const dpr: [number, number] = quality === "full" ? [1, Math.min(2, ratio)] : [0.75, Math.min(1.4, ratio)];

  return (
    <div className="stage" aria-hidden>
      <Canvas
        eventSource={typeof document !== "undefined" ? document.body : undefined}
        eventPrefix="client"
        dpr={dpr}
        frameloop={visible ? "always" : "never"}
        gl={{ antialias: quality === "full", alpha: true, powerPreference: "high-performance", stencil: false }}
        camera={{ position: [0, 0, 8], fov: 35 }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.domElement.addEventListener("webglcontextlost", (e) => {
            e.preventDefault();
            stepDown();
          });
        }}
      >
        <View.Port />
        <Progress />
        <Monitor />
      </Canvas>
    </div>
  );
}
