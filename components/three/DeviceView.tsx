"use client";
// A project's real screens on a laptop and/or phone. Turns gently with the pointer.
import { ContactShadows, Environment, Float, Lightformer, PerspectiveCamera, View } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import { useDark } from "@/lib/theme";
import { Laptop, Phone } from "./devices";
import { useShown, useWarm } from "./useWarm";

function Devices({ web, mobile }: { web?: string; mobile?: string }) {
  const dark = useDark();
  const g = useRef<THREE.Group>(null);
  const ready = useWarm("device:" + (web ?? mobile));
  const shown = useShown(ready);
  useFrame(({ pointer, clock }) => {
    if (!g.current) return;
    g.current.rotation.y = THREE.MathUtils.lerp(g.current.rotation.y, pointer.x * 0.3 + Math.sin(clock.elapsedTime * 0.4) * 0.08, 0.05);
  });
  return (
    <>
    {shown && <ContactShadows position={[0, -0.62, 0]} opacity={dark ? 0.55 : 0.3} scale={8} blur={2.4} far={2.5} frames={1} resolution={256} />}
    <group ref={g} scale={shown ? 1 : 0.0001}>
      {web && (
        <Laptop screen={web} dark={dark} position={[mobile ? -0.45 : 0, -0.55, 0]} rotation={[0.05, 0, 0]} scale={0.92} />
      )}
      {mobile && (
        <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.5}>
          <Phone screen={mobile} dark={dark} position={web ? [1.55, 0.05, 0.7] : [0, 0, 0]} rotation={[0, web ? -0.35 : 0, 0]} scale={web ? 0.9 : 1.15} />
        </Float>
      )}
    </group>
    </>
  );
}

export default function DeviceView({ web, mobile }: { web?: string; mobile?: string }) {
  return (
    <View className="absolute inset-0">
      <PerspectiveCamera makeDefault position={[0, 1.2, 6.2]} fov={32} onUpdate={(c) => c.lookAt(0, 0.1, 0)} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 4]} intensity={1.5} />
      <Environment resolution={64} frames={1}>
        <Lightformer form="rect" intensity={2.4} position={[0, 5, 3]} scale={[10, 3, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} />
      </Environment>
      <Suspense fallback={null}>
        <Devices web={web} mobile={mobile} />
      </Suspense>
    </View>
  );
}
