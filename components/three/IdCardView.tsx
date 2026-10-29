"use client";
// About page: my ID card drops in on a lanyard as you scroll, swings, and settles.
// You can push it around with the pointer. The front is drawn from my real photo.
import { Environment, Lightformer, PerspectiveCamera, RoundedBox, View } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { profile } from "@/content/site";
import { useDark } from "@/lib/theme";
import { useShown, useWarm } from "./useWarm";

const W = 2.1, H = 3.2;

function useCardTexture() {
  const [tex, setTex] = useState<THREE.CanvasTexture | null>(null);
  useEffect(() => {
    const c = document.createElement("canvas");
    c.width = 840;
    c.height = 1280;
    const g = c.getContext("2d")!;
    const draw = (img?: HTMLImageElement) => {
      g.fillStyle = "#fbfbfb";
      g.fillRect(0, 0, c.width, c.height);
      // Header band
      g.fillStyle = "#0b0b0c";
      g.fillRect(0, 0, c.width, 190);
      g.fillStyle = "#ffffff";
      g.font = "800 54px 'Bricolage Grotesque', system-ui, sans-serif";
      g.fillText("EMEMZYVISUALS", 60, 118);
      g.font = "600 24px 'Outfit', system-ui, sans-serif";
      g.fillStyle = "rgba(255,255,255,0.6)";
      g.fillText("AXIVERI · PLOTWEAVER", 62, 160);
      // Photo
      const px = 60, py = 250, ps = 340;
      g.save();
      g.beginPath();
      g.roundRect(px, py, ps, ps, 36);
      g.clip();
      if (img) g.drawImage(img, px, py, ps, ps);
      else { g.fillStyle = "#ddd"; g.fillRect(px, py, ps, ps); }
      g.restore();
      // Name and role
      g.fillStyle = "#0b0b0c";
      g.font = "800 82px 'Bricolage Grotesque', system-ui, sans-serif";
      g.fillText("Emmanuel", 60, 720);
      g.fillText("Ariyo", 60, 805);
      g.font = "500 34px 'Outfit', system-ui, sans-serif";
      g.fillStyle = "#3a3a3d";
      g.fillText("Machine Learning Engineer", 62, 870);
      g.fillText("Founder, Axiveri", 62, 916);
      // Pill
      g.fillStyle = "#0b0b0c";
      g.beginPath();
      g.roundRect(440, 270, 330, 70, 35);
      g.fill();
      g.fillStyle = "#fff";
      g.font = "700 28px 'Outfit', system-ui, sans-serif";
      g.fillText("Self-taught", 488, 316);
      g.fillStyle = "#0b0b0c";
      g.font = "600 26px 'Outfit', system-ui, sans-serif";
      g.fillText("Location", 442, 420);
      g.fillText("ID", 442, 520);
      g.font = "800 34px 'Bricolage Grotesque', system-ui, sans-serif";
      g.fillText("Nigeria", 442, 460);
      g.fillText("EA-0001", 442, 560);
      // Barcode
      let x = 60;
      for (let i = 0; i < 64; i++) {
        const w = 2 + ((i * 7919) % 5);
        g.fillRect(x, 1020, w, 140);
        x += w + 3 + ((i * 31) % 4);
        if (x > 780) break;
      }
      g.font = "500 22px ui-monospace, monospace";
      g.fillText("ememzyvisuals@gmail.com", 60, 1200);
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      setTex(t);
    };
    const img = new Image();
    img.onload = () => document.fonts.ready.then(() => draw(img));
    img.onerror = () => draw();
    img.src = profile.photo;
  }, []);
  return tex;
}

function Card({ anchor }: { anchor: React.RefObject<HTMLElement> }) {
  const dark = useDark();
  const tex = useCardTexture();
  const pivot = useRef<THREE.Group>(null);
  const strap = useRef<THREE.Mesh>(null);
  const st = useRef({ y: 7, vy: 0, a: 0.5, va: 0, dropped: false });
  const ready = useWarm("idcard");
  const shown = useShown(ready && !!tex);

  const strapGeo = useMemo(() => new THREE.BoxGeometry(0.34, 1, 0.012), []);

  useFrame(({ pointer }, dtRaw) => {
    const dt = Math.min(dtRaw, 1 / 30);
    const el = anchor.current;
    let p = 1;
    if (el) {
      const r = el.getBoundingClientRect();
      p = THREE.MathUtils.clamp((innerHeight - r.top) / (innerHeight * 0.6), 0, 1);
    }
    const s = st.current;
    const targetY = shown ? THREE.MathUtils.lerp(4.5, 0, p) : 7;
    const ay = (targetY - s.y) * 60 - s.vy * 9;
    s.vy += ay * dt;
    s.y += s.vy * dt;
    // Pendulum swing: kicked by vertical motion and the pointer.
    const aa = -14 * Math.sin(s.a) - 1.4 * s.va + s.vy * 0.06 + pointer.x * 1.2;
    s.va += aa * dt;
    s.a += s.va * dt;
    if (pivot.current) {
      pivot.current.position.y = 2.6 + s.y;
      pivot.current.rotation.z = s.a * 0.35;
      pivot.current.rotation.y = Math.sin(s.a * 1.3) * 0.5 + pointer.x * 0.25;
    }
    if (strap.current) {
      // Strap runs from the top of the view down to the card clip.
      const top = 7;
      const len = Math.max(0.1, top - (2.6 + s.y));
      strap.current.scale.y = len;
      strap.current.position.y = top - len / 2;
      strap.current.rotation.z = s.a * 0.12;
    }
  });

  return (
    <group>
      <mesh ref={strap} geometry={strapGeo}>
        <meshStandardMaterial color={dark ? "#e5e5e5" : "#0b0b0c"} roughness={0.6} />
      </mesh>
      <group ref={pivot}>
        {/* Clip */}
        <RoundedBox args={[0.5, 0.24, 0.08]} radius={0.04} position={[0, 0, 0]}>
          <meshStandardMaterial color="#a7abb3" metalness={0.9} roughness={0.25} />
        </RoundedBox>
        <group position={[0, -0.12 - H / 2, 0]}>
          <RoundedBox args={[W, H, 0.035]} radius={0.12} smoothness={6}>
            <meshPhysicalMaterial color={dark ? "#1b1b1d" : "#ffffff"} roughness={0.25} clearcoat={1} clearcoatRoughness={0.06} />
          </RoundedBox>
          {tex && (
            <mesh position={[0, 0, 0.019]}>
              <planeGeometry args={[W - 0.08, H - 0.08]} />
              <meshPhysicalMaterial map={tex} roughness={0.35} clearcoat={1} clearcoatRoughness={0.08} />
            </mesh>
          )}
          {/* Punched slot */}
          <mesh position={[0, H / 2 - 0.16, 0.02]}>
            <planeGeometry args={[0.42, 0.07]} />
            <meshBasicMaterial color={dark ? "#0a0a0a" : "#fafafa"} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

export default function IdCardView({ anchor }: { anchor: React.RefObject<HTMLElement> }) {
  return (
    <View className="absolute inset-0">
      <PerspectiveCamera makeDefault position={[0, 0, 9]} fov={32} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 6]} intensity={1.6} />
      <Environment resolution={64} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 4, 5]} scale={[10, 2, 1]} />
        <Lightformer form="rect" intensity={1.5} position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} />
      </Environment>
      <Suspense fallback={null}>
        <Card anchor={anchor} />
      </Suspense>
    </View>
  );
}
