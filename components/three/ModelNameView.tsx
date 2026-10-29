"use client";
// Each model card shows the model's name as thick 3D type, with a small motif for what
// the model does: sound bars for speech recognition, rings for voice, tokens for language,
// frames for images. It turns toward the pointer and lifts when you hover the card.
import { Center, Environment, Lightformer, PerspectiveCamera, Text3D, View } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Suspense, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { Model } from "@/content/site";
import { getStage } from "@/lib/stage";
import { useDark } from "@/lib/theme";
import { useQuality } from "@/lib/quality";
import { useShown, useWarm } from "./useWarm";

const FONT = "/fonts/bricolage-800.typeface.json";

function Motif({ slug, tone }: { slug: string; tone: string }) {
  const group = useRef<THREE.Group>(null);
  const bars = 18;
  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    const t = clock.elapsedTime;
    g.children.forEach((c, i) => {
      if (slug === "naijavox") c.scale.y = 0.25 + Math.abs(Math.sin(t * 2.2 + i * 0.55)) * (0.7 + 0.3 * Math.sin(i));
      else if (slug === "wazobiavoice") {
        const s = 1 + ((t * 0.5 + i / 4) % 1) * 2.2;
        c.scale.setScalar(s);
        ((c as THREE.Mesh).material as THREE.MeshStandardMaterial).opacity = 1 - ((t * 0.5 + i / 4) % 1);
      } else if (slug === "africlaude") {
        c.position.y = Math.sin(t * 1.3 + i) * 0.18 + (i % 3) * 0.12 - 0.1;
        c.rotation.z = Math.sin(t + i) * 0.3;
      } else c.rotation.y = Math.sin(t * 0.8 + i * 0.6) * 0.5;
    });
  });
  const mat = <meshStandardMaterial color={tone} roughness={0.3} metalness={0.1} transparent />;
  if (slug === "naijavox")
    return (
      <group ref={group} position={[0, -0.95, -0.6]}>
        {Array.from({ length: bars }, (_, i) => (
          <mesh key={i} position={[(i - bars / 2) * 0.22, 0, 0]}>
            <boxGeometry args={[0.1, 0.9, 0.1]} />
            {mat}
          </mesh>
        ))}
      </group>
    );
  if (slug === "wazobiavoice")
    return (
      <group ref={group} position={[0, 0, -1]}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i}>
            <torusGeometry args={[0.6, 0.025, 8, 64]} />
            {mat}
          </mesh>
        ))}
      </group>
    );
  if (slug === "africlaude")
    return (
      <group ref={group} position={[0, 0, -0.9]}>
        {Array.from({ length: 9 }, (_, i) => (
          <mesh key={i} position={[(i - 4) * 0.55, 0, (i % 2) * -0.3]}>
            <boxGeometry args={[0.32, 0.18, 0.06]} />
            {mat}
          </mesh>
        ))}
      </group>
    );
  return (
    <group ref={group} position={[0, 0, -1]}>
      {[-1.6, -0.55, 0.55, 1.6].map((x, i) => (
        <mesh key={i} position={[x, (i % 2) * 0.25 - 0.1, 0]}>
          <boxGeometry args={[0.8, 0.6, 0.04]} />
          {mat}
        </mesh>
      ))}
    </group>
  );
}

function Name({ model }: { model: Model }) {
  const dark = useDark();
  const { quality } = useQuality();
  const { size, pointer } = useThree();
  const g = useRef<THREE.Group>(null);
  const lift = useRef(0);
  const ready = useWarm("model:" + model.slug);
  const shown = useShown(ready);
  // Fit the word inside the card: measure the real text width once it is built.
  const [textW, setTextW] = useState(0);
  const visibleW = useMemo(() => 2 * Math.tan(THREE.MathUtils.degToRad(15)) * 6 * (size.width / size.height), [size.width, size.height]);
  const fit = textW ? Math.min(1.25, (visibleW * 0.78) / textW) : 0.0001;
  const caps = useMemo(() => new THREE.MeshPhysicalMaterial({ color: dark ? "#f4f4f5" : "#141416", roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.1 }), [dark]);
  const sides = useMemo(() => new THREE.MeshStandardMaterial({ color: model.tone, roughness: 0.4, metalness: 0.05 }), [model.tone]);

  useFrame((_, dt) => {
    if (!g.current) return;
    const hot = getStage().focus === "model:" + model.slug;
    lift.current += ((hot ? 1 : 0) - lift.current) * Math.min(1, dt * 6);
    g.current.rotation.y = THREE.MathUtils.lerp(g.current.rotation.y, pointer.x * 0.25, 0.06);
    g.current.rotation.x = THREE.MathUtils.lerp(g.current.rotation.x, -pointer.y * 0.15 - 0.12, 0.06);
    g.current.position.z = lift.current * 0.6;
    g.current.position.y = 0.15;
  });

  return (
    <group scale={shown ? 1 : 0.0001}>
      <Motif slug={model.slug} tone={model.tone} />
      <group ref={g} scale={fit}>
        <Center onCentered={({ width }) => setTextW(width)}>
          <Text3D font={FONT} size={1} height={0.42} curveSegments={quality === "full" ? 8 : 4} bevelEnabled bevelThickness={0.04} bevelSize={0.025} bevelSegments={quality === "full" ? 3 : 1} material={[caps, sides]}>
            {model.name}
          </Text3D>
        </Center>
      </group>
    </group>
  );
}

export default function ModelNameView({ model }: { model: Model }) {
  return (
    <View className="absolute inset-0">
      <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={30} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 4, 5]} intensity={1.8} />
      <Environment resolution={64} frames={1}>
        <Lightformer form="rect" intensity={2.5} position={[0, 3, 4]} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={1.5} color={model.tone} position={[-4, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} />
      </Environment>
      <Suspense fallback={null}>
        <Name model={model} />
      </Suspense>
    </View>
  );
}
