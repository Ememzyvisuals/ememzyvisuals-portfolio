"use client";
// Hero: a laptop and a phone showing real projects. The lid opens when you enter,
// the screens rotate through my work, and the camera swings round as you scroll.
import { ContactShadows, Environment, Float, Lightformer, PerspectiveCamera, View, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";
import * as THREE from "three";
import { getStage } from "@/lib/stage";
import { useDark } from "@/lib/theme";
import { useQuality } from "@/lib/quality";
import { Laptop, Phone } from "./devices";
import { useShown, useWarm } from "./useWarm";

const WEB = ["/tex/claudgpt-web.webp", "/tex/aethlife-web.webp", "/tex/flonextv-web.webp", "/tex/naijaprep-web.webp"];
const MOBILE = ["/tex/flonextv-mobile1.webp", "/tex/felicia-home.webp", "/tex/naijaprep-mobile.webp", "/tex/lumeo-intro.webp"];
useTexture.preload(WEB);
useTexture.preload(MOBILE);

function Scene({ anchor }: { anchor: React.RefObject<HTMLElement> }) {
  const dark = useDark();
  const { quality } = useQuality();
  const [i, setI] = useState(0);
  const rig = useRef<THREE.Group>(null);
  const cam = useRef<THREE.PerspectiveCamera>(null);
  const open = useRef(0.08);
  const [lid, setLid] = useState(0.08);
  const t = useRef(0);
  const pop = useRef<THREE.Group>(null);
  const popV = useRef({ s: 0.0001, v: 0 });
  const ready = useWarm("hero");
  const shown = useShown(ready);

  useFrame((state, dt) => {
    t.current += dt;
    // Springy entrance once the loader is gone.
    const ps = popV.current;
    const a = ((shown ? 1 : 0.0001) - ps.s) * 120 - ps.v * 11;
    ps.v += a * Math.min(dt, 1 / 30);
    ps.s = Math.max(0.0001, ps.s + ps.v * Math.min(dt, 1 / 30));
    if (pop.current) pop.current.scale.setScalar(ps.s);
    const entered = getStage().entered;
    // Lid opens once the visitor is in.
    const target = entered ? 1 : 0.08;
    open.current += (target - open.current) * Math.min(1, dt * 2.2);
    if (Math.abs(open.current - lid) > 0.004) setLid(open.current);
    // Rotate screens every 4 seconds.
    const n = Math.floor(t.current / 4) % WEB.length;
    if (n !== i) setI(n);
    // Scroll progress through the hero section swings the camera.
    const el = anchor.current;
    let p = 0;
    if (el) {
      const r = el.getBoundingClientRect();
      p = THREE.MathUtils.clamp(-r.top / Math.max(1, r.height), 0, 1);
    }
    const ang = -0.35 + p * 1.1 + state.pointer.x * 0.08;
    if (cam.current) {
      cam.current.position.set(0.65 + Math.sin(ang) * 10.5, 2.6 + p * 1.4 - state.pointer.y * 0.25, Math.cos(ang) * 10.5);
      cam.current.lookAt(0.65, 0.5, 0);
    }
    if (rig.current) rig.current.position.y = -0.2 - p * 0.6;
  });

  return (
    <>
    {/* Shadows mount only once the scene is visible, outside the scaled group, so they capture the real devices. */}
    {shown && <ContactShadows position={[0.4, -0.3, 0]} opacity={dark ? 0.6 : 0.35} scale={9} blur={2.6} far={3} frames={quality === "full" ? Infinity : 1} resolution={quality === "full" ? 512 : 256} />}
    <group ref={pop} scale={0.0001}>
      <PerspectiveCamera ref={cam} makeDefault fov={30} position={[0, 2, 7]} />
      <group ref={rig}>
        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.35}>
          <Laptop screen={WEB[i]} dark={dark} open={lid} rotation={[0, 0.25, 0]} position={[-0.35, 0, 0]} />
        </Float>
        <Float speed={1.6} rotationIntensity={0.3} floatIntensity={0.6}>
          <Phone screen={MOBILE[i]} dark={dark} position={[1.75, 0.95, 0.9]} rotation={[-0.08, -0.45, 0.06]} />
        </Float>
      </group>
    </group>
    </>
  );
}

export default function HeroView({ anchor }: { anchor: React.RefObject<HTMLElement> }) {
  return (
    <View className="absolute inset-0">
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 5]} intensity={1.5} />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2.6} position={[0, 5, 3]} scale={[10, 3, 1]} />
        <Lightformer form="rect" intensity={1.4} position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} />
        <Lightformer form="rect" intensity={1.4} position={[5, 1, -1]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} />
      </Environment>
      <Suspense fallback={null}>
        <Scene anchor={anchor} />
      </Suspense>
    </View>
  );
}
