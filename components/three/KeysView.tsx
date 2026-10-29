"use client";
// Keycaps drawn on top of the HTML stack list. Positions come from the real DOM rects,
// so the layout is always correct on any screen size. Hover or focus presses a key.
import { Environment, Lightformer, OrthographicCamera, RoundedBox, Text, View } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { getStage } from "@/lib/stage";
import { useDark } from "@/lib/theme";
import { useQuality } from "@/lib/quality";
import { useShown, useWarm } from "./useWarm";

type K = { label: string; x: number; y: number; w: number; h: number };

function Keys({ container }: { container: React.RefObject<HTMLDivElement> }) {
  const { size } = useThree();
  const dark = useDark();
  const { quality } = useQuality();
  const [keys, setKeys] = useState<K[]>([]);
  const groups = useRef<(THREE.Group | null)[]>([]);
  const press = useRef<number[]>([]);
  const ready = useWarm("keys");
  const shown = useShown(ready);

  useEffect(() => {
    const el = container.current;
    if (!el) return;
    const measure = () => {
      const box = el.getBoundingClientRect();
      const out: K[] = [];
      el.querySelectorAll<HTMLElement>("[data-key]").forEach((n) => {
        const r = n.getBoundingClientRect();
        out.push({
          label: n.dataset.key!,
          x: r.left - box.left + r.width / 2 - box.width / 2,
          y: -(r.top - box.top + r.height / 2 - box.height / 2),
          w: r.width,
          h: r.height,
        });
      });
      setKeys(out);
      press.current = out.map(() => 0);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [container, size.width]);

  useFrame(({ clock }, dt) => {
    const focus = getStage().focus;
    const t = clock.elapsedTime;
    keys.forEach((k, i) => {
      const g = groups.current[i];
      if (!g) return;
      const hot = focus === "key:" + k.label;
      press.current[i] += ((hot ? 1 : 0) - press.current[i]) * Math.min(1, dt * 14);
      const idle = Math.sin(t * 1.4 + i * 0.9) * 0.6;
      g.position.set(k.x, k.y + idle, -press.current[i] * 9);
      g.rotation.x = 0.32 + press.current[i] * 0.06;
    });
  });

  const cap = dark ? "#1a1a1c" : "#fbfbfb";
  const side = dark ? "#0e0e10" : "#d9d9de";
  const ink = dark ? "#f2f2f2" : "#111111";
  return (
    <group scale={shown ? 1 : 0.0001}>
      {keys.map((k, i) => (
        <group key={k.label + i} ref={(g) => { groups.current[i] = g; }} position={[k.x, k.y, 0]} rotation-x={0.32}>
          {/* Keycap: a wider darker skirt under a lighter top. */}
          <RoundedBox args={[k.w, k.h, 18]} radius={8} smoothness={quality === "full" ? 4 : 2} position={[0, -3, -6]}>
            <meshStandardMaterial color={side} roughness={0.55} />
          </RoundedBox>
          <RoundedBox args={[k.w - 6, k.h - 6, 12]} radius={7} smoothness={quality === "full" ? 4 : 2} position={[0, 1, 2]}>
            <meshPhysicalMaterial color={cap} roughness={0.35} clearcoat={0.6} clearcoatRoughness={0.3} />
          </RoundedBox>
          <Text
            font="/fonts/bricolage-800.woff"
            fontSize={Math.min(17, k.h * 0.36)}
            color={ink}
            anchorX="center"
            anchorY="middle"
            position={[0, 1.5, 8.2]}
            maxWidth={k.w - 14}
          >
            {k.label}
          </Text>
        </group>
      ))}
    </group>
  );
}

export default function KeysView({ container }: { container: React.RefObject<HTMLDivElement> }) {
  return (
    <View className="absolute inset-0">
      <OrthographicCamera makeDefault position={[0, 0, 600]} zoom={1} near={1} far={2000} />
      <ambientLight intensity={0.85} />
      <directionalLight position={[200, 500, 600]} intensity={1.3} />
      <Environment resolution={64} frames={1}>
        <Lightformer form="rect" intensity={2} position={[0, 4, 4]} scale={[10, 2, 1]} />
      </Environment>
      <Keys container={container} />
    </View>
  );
}
