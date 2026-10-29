"use client";
// Certificates page: the real certificates float on a slow ring. Drag-free: the pointer tilts it.
import { Environment, Lightformer, PerspectiveCamera, RoundedBox, View, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense, useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { certificates } from "@/content/site";
import { useShown, useWarm } from "./useWarm";

function Ring() {
  const texs = useTexture(certificates.map((c) => c.image));
  useLayoutEffect(() => texs.forEach((t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; }), [texs]);
  const ring = useRef<THREE.Group>(null);
  const ready = useWarm("certs");
  const shown = useShown(ready);
  const n = certificates.length;
  const R = 3.3;
  useFrame(({ pointer }, dt) => {
    if (!ring.current) return;
    ring.current.rotation.y += dt * 0.12;
    // Every certificate keeps facing the viewer while the ring turns.
    ring.current.children.forEach((c) => (c.rotation.y = -ring.current!.rotation.y));
    ring.current.rotation.x = THREE.MathUtils.lerp(ring.current.rotation.x, 0.12 - pointer.y * 0.12, 0.05);
  });
  return (
    <group scale={shown ? 1 : 0.0001}>
      <group ref={ring}>
        {certificates.map((c, i) => {
          const a = (i / n) * Math.PI * 2;
          const img = texs[i].image as HTMLImageElement;
          const asp = img ? img.width / img.height : 1.62;
          const w = 1.9, h = w / asp;
          return (
            <group key={c.slug} position={[Math.sin(a) * R, Math.sin(i * 1.7) * 0.25, Math.cos(a) * R]} >
              <RoundedBox args={[w + 0.08, h + 0.08, 0.04]} radius={0.04}>
                <meshPhysicalMaterial color="#ffffff" roughness={0.3} clearcoat={1} />
              </RoundedBox>
              <mesh position={[0, 0, 0.021]}>
                <planeGeometry args={[w, h]} />
                <meshBasicMaterial map={texs[i]} toneMapped={false} />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}

export default function CertRingView() {
  return (
    <View className="absolute inset-0">
      <PerspectiveCamera makeDefault position={[0, 1.1, 9.5]} fov={30} onUpdate={(c) => c.lookAt(0, 0, 0)} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 5, 6]} intensity={1.2} />
      <Environment resolution={64} frames={1}>
        <Lightformer form="rect" intensity={2.5} position={[0, 4, 5]} scale={[10, 2, 1]} />
      </Environment>
      <Suspense fallback={null}>
        <Ring />
      </Suspense>
    </View>
  );
}
