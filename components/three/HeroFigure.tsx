"use client";
// components/three/HeroFigure.tsx
//
// The GLB figure itself, plus lighting. Kept deliberately simple —
// no external HDR/environment assets, just a couple of lights — so the
// whole thing is self-contained and can't fail on a network hiccup.
//
// Animation note: the current model (sample.glb) is a single static mesh
// with no rig or animation clips, so per-limb "typing" motion isn't
// possible on it yet. What's implemented instead is whole-figure cursor
// tracking (it turns toward the pointer, like glancing at it) blended
// with a continuous subtle "focused at the screen" sway/bob. Once a
// rigged model with a head/hand hierarchy or baked animation clips is
// dropped in, this can be upgraded to real per-part motion via useAnimations.

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import type { Group } from "three";
import * as THREE from "three";

function Model() {
  const { scene } = useGLTF("/models/hero-figure.glb");
  const ref = useRef<Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const scrollT = useRef(0); // 0 = top of page (facing left), 1 = scrolled past hero (facing front)

  useEffect(() => {
    function handleScroll() {
      const heroHeight = window.innerHeight;
      const progress = Math.min(1, Math.max(0, window.scrollY / heroHeight));
      scrollT.current = progress;
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track normalized pointer position, updated in useFrame via
  // state.pointer (already normalized -1..1 by R3F) — no extra listeners.
  useFrame(({ clock, pointer: framePointer }) => {
    if (!ref.current) return;

    pointer.current.x = THREE.MathUtils.lerp(pointer.current.x, framePointer.x, 0.04);
    pointer.current.y = THREE.MathUtils.lerp(pointer.current.y, framePointer.y, 0.04);

    const t = clock.getElapsedTime();

    // Idle "focused at the screen" sway — small, continuous, never stops
    const idleYaw = Math.sin(t * 0.35) * 0.05;
    const idleBob = Math.sin(t * 1.1) * 0.015;
    const idlePitch = Math.sin(t * 0.5) * 0.02;

    // Scroll-driven turn: starts angled to the side on page load, eases to
    // facing forward as the page scrolls past the hero.
    const scrollYaw = THREE.MathUtils.lerp(-0.7, 0, scrollT.current);

    // Cursor-tracking turn — subtle, capped so it never looks unnatural
    const cursorYaw = pointer.current.x * 0.18;
    const cursorPitch = -pointer.current.y * 0.1;

    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      scrollYaw + idleYaw + cursorYaw,
      0.08
    );
    ref.current.rotation.x = idlePitch + cursorPitch;
    ref.current.position.y = idleBob;
  });

  return (
    <Center top>
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
