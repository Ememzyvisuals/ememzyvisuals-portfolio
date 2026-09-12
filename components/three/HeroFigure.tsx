"use client";
// components/three/HeroFigure.tsx
//
// The GLB figure itself, plus lighting. Kept deliberately simple —
// no external HDR/environment assets, just a couple of lights — so the
// whole thing is self-contained and can't fail on a network hiccup.

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import type { Group } from "three";

function Model() {
  const { scene } = useGLTF("/models/hero-figure.glb");
  const ref = useRef<Group>(null);

  // Gentle idle sway — subtle, not distracting, never fully spins away
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.35) * 0.25;
  });

  return (
    <Center>
      <group ref={ref}>
        <primitive object={scene} />
      </group>
    </Center>
  );
}

export function HeroFigure() {
  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 5, 4]} intensity={1.1} />
      <directionalLight position={[-4, 2, -3]} intensity={0.4} />
      <Model />
    </>
  );
}

// Preload so the model starts fetching as soon as the module loads,
// instead of waiting for the Canvas to mount.
useGLTF.preload("/models/hero-figure.glb");
