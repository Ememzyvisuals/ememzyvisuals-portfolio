"use client";
// The loader: EMEMZYVISUALS as thick glass letters that drop in as the site loads,
// land with a jelly bounce, lean toward the pointer, and fly apart when you enter.
import { Center, Environment, Lightformer, MeshTransmissionMaterial, PerspectiveCamera, Text3D, View, useFBO, useFont } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useQuality } from "@/lib/quality";
import { getStage, setStage } from "@/lib/stage";
import { useWarm } from "./useWarm";

const FONT = "/fonts/bricolage-800.typeface.json";
const WORD = "EMEMZYVISUALS";
const SIZE = 1;
const DEPTH = 0.42;

type Body = { y: number; v: number; dropped: boolean; t: number; sx: number; sy: number; kick: number };

function isDark() {
  return typeof document !== "undefined" && document.documentElement.classList.contains("dark");
}

// Fine moving lines behind the word so the glass has something to bend. Fades on exit.
function Backdrop({ dark, fade }: { dark: boolean; fade: React.MutableRefObject<number> }) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 512;
    const g = c.getContext("2d")!;
    g.fillStyle = dark ? "#0a0a0a" : "#f7f7f7";
    g.fillRect(0, 0, 512, 512);
    g.fillStyle = dark ? "rgba(245,245,245,0.9)" : "rgba(10,10,10,0.9)";
    // Vertical lines tile perfectly; the plane is turned to make them diagonal.
    for (let i = 0; i < 8; i++) g.fillRect(i * 64 + 27, 0, 10, 512);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(10, 10);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, [dark]);
  const veilTex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d")!;
    const grd = g.createRadialGradient(128, 128, 10, 128, 128, 128);
    grd.addColorStop(0, "rgba(255,255,255,0)");
    grd.addColorStop(0.28, "rgba(255,255,255,0.15)");
    grd.addColorStop(0.6, "rgba(255,255,255,0.85)");
    grd.addColorStop(1, "rgba(255,255,255,1)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c);
    t.repeat.set(1.4, 1.9);
    t.offset.set(0.5 - 0.7, 0.5 - 0.95);
    t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
    return t;
  }, []);
  const veil = useRef<THREE.MeshBasicMaterial>(null);
  const lines = useRef<THREE.MeshBasicMaterial>(null);
  useFrame((_, dt) => {
    tex.offset.x = (tex.offset.x + dt * 0.05) % 1;
    if (lines.current) lines.current.opacity = 1 - fade.current;
    if (veil.current) veil.current.opacity = 1 - fade.current;
  });
  return (
    <group position={[0, 0, -3.2]}>
      <mesh rotation-z={-0.55}>
        <planeGeometry args={[44, 44]} />
        <meshBasicMaterial ref={lines} map={tex} toneMapped={false} transparent />
      </mesh>
      {/* Soft veil: lines stay crisp behind the word and fade towards the edges. */}
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[40, 20]} />
        <meshBasicMaterial ref={veil} map={veilTex} color={dark ? "#0a0a0a" : "#f7f7f7"} transparent opacity={1} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Letters({ leaving }: { leaving: boolean }) {
  const { quality } = useQuality();
  const full = quality === "full";
  const font = useFont(FONT) as unknown as { data: { glyphs: Record<string, { ha: number }>; resolution: number } };
  const { size, gl, scene, camera, pointer } = useThree();
  const dark = useMemo(isDark, []);
  const twoLines = size.width / size.height < 0.9;

  // Layout from the font's own advance widths.
  const layout = useMemo(() => {
    const lines = twoLines ? ["EMEMZY", "VISUALS"] : [WORD];
    const res = font.data.resolution || 1000;
    const out: { ch: string; x: number; y: number; i: number }[] = [];
    let idx = 0;
    let widest = 0;
    lines.forEach((line, li) => {
      const adv = line.split("").map((ch) => ((font.data.glyphs[ch]?.ha ?? 600) / res) * SIZE * 1.02);
      const w = adv.reduce((a, b) => a + b, 0);
      widest = Math.max(widest, w);
      let x = -w / 2;
      line.split("").forEach((ch, k) => {
        out.push({ ch, x: x + adv[k] / 2, y: (lines.length - 1) * 0.62 - li * 1.32, i: idx++ });
        x += adv[k];
      });
    });
    return { out, widest, lines: lines.length };
  }, [font, twoLines]);

  // Fit to screen.
  const cam = camera as THREE.PerspectiveCamera;
  const visibleW = 2 * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * 8 * (size.width / size.height);
  const scale = Math.min(1.25, (visibleW * (twoLines ? 0.86 : 0.88)) / layout.widest);

  const bodies = useRef<Body[]>(WORD.split("").map(() => ({ y: 7, v: 0, dropped: false, t: 0, sx: 1, sy: 1, kick: 0 })));
  const refs = useRef<(THREE.Group | null)[]>([]);
  const root = useRef<THREE.Group>(null);
  const glass = useRef<THREE.Group>(null);
  const backdrop = useRef<THREE.Group>(null);
  const fbo = useFBO(full ? 1024 : 4, full ? 1024 : 4);
  const clock = useRef(0);
  const leftAt = useRef(0);
  const fade = useRef(0);
  const settledFor = useRef(0);

  const ready = useWarm("loader", () => setStage({ letters: true }));
  useEffect(() => () => setStage({ letters: false, settled: false }), []);

  useFrame((state, dtRaw) => {
    const real = Math.min(dtRaw, 0.25);
    const steps = Math.max(1, Math.ceil(real / (1 / 60)));
    const dt = real / steps;
    for (let s = 0; s < steps; s++) step(state, dt, s === steps - 1);
    renderBuffer();
  });

  function step(state: { pointer: THREE.Vector2 }, dt: number, last: boolean) {
    clock.current += dt;
    const progress = getStage().progress;
    const n = WORD.length;

    // Each letter drops when loading has reached its share of the word.
    if (leaving && !leftAt.current) leftAt.current = clock.current;
    const sinceLeave = leftAt.current ? clock.current - leftAt.current : -1;
    let still = true;
    bodies.current.forEach((b, i) => {
      if (!b.dropped && ready && (progress >= (i + 1) / (n + 1) || progress >= 1) && clock.current > 0.25 + i * 0.07) {
        b.dropped = true;
        b.v = -2;
      }
      if (!b.dropped) {
        still = false;
        return;
      }
      // On exit every letter does one last hop, left to right.
      if (sinceLeave >= i * 0.035 && !b.kick) {
        b.kick = 1;
        b.v = 5.5;
      }
      const k = 140, c = 7.5;
      const a = -k * b.y - c * b.v;
      b.v += a * dt;
      b.y += b.v * dt;
      if (Math.abs(b.y) > 0.015 || Math.abs(b.v) > 0.05) still = false;
      const squash = THREE.MathUtils.clamp(a * 0.0035, -0.22, 0.32);
      b.sy += (1 - squash - b.sy) * Math.min(1, dt * 30);
      b.sx = 1 / Math.sqrt(Math.max(0.5, b.sy));
      const g = refs.current[i];
      if (g) {
        g.position.y = layout.out[i].y + b.y;
        g.scale.set(b.sx, b.sy, b.sx);
        // Small wobble that settles, and a lean toward the pointer.
        const near = 1 - Math.min(1, Math.abs((state.pointer.x * (visibleW / 2)) / scale - layout.out[i].x) / 2.2);
        g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, THREE.MathUtils.clamp(-b.v * 0.012, -0.12, 0.12) + state.pointer.x * 0.05 * near, 0.15);
        g.position.z = THREE.MathUtils.lerp(g.position.z, near * 0.35 * (full ? 1 : 0.6), 0.08);
      }
    });
    // Tell the loader once the whole word has landed and stopped wobbling.
    settledFor.current = still ? settledFor.current + dt : 0;
    if (settledFor.current > 0.35 && !getStage().settled) setStage({ settled: true });

    if (root.current) {
      root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, pointer.x * 0.28 + Math.sin(clock.current * 0.35) * 0.08, 0.05);
      root.current.rotation.x = THREE.MathUtils.lerp(root.current.rotation.x, -pointer.y * 0.18 + Math.cos(clock.current * 0.27) * 0.04, 0.05);
    }
    // Slow camera drift, then a dolly through the word on exit.
    const exitT = leftAt.current ? THREE.MathUtils.clamp((clock.current - leftAt.current - 0.25) / 0.85, 0, 1) : 0;
    const e = exitT * exitT * (3 - 2 * exitT);
    fade.current = THREE.MathUtils.clamp((exitT - 0.45) / 0.55, 0, 1);
    cam.position.x = Math.sin(clock.current * 0.22) * 0.45 * (1 - e);
    cam.position.y = Math.cos(clock.current * 0.18) * 0.2 * (1 - e);
    cam.position.z = 8 - e * 10.5;
    cam.lookAt(cam.position.x, cam.position.y, cam.position.z - 8);

    void last;
  }

  // Shared refraction buffer: render the backdrop once, every letter samples it.
  function renderBuffer() {
    if (full && glass.current) {
      glass.current.visible = false;
      gl.setRenderTarget(fbo);
      gl.clear();
      gl.render(scene, camera);
      gl.setRenderTarget(null);
      glass.current.visible = true;
    }
  }

  const material = full ? (
    <MeshTransmissionMaterial
      buffer={fbo.texture}
      resolution={4}
      backsideResolution={4}
      transmission={1}
      thickness={0.9}
      roughness={0.04}
      ior={1.42}
      chromaticAberration={0.08}
      anisotropy={0.15}
      distortion={0.15}
      distortionScale={0.4}
      temporalDistortion={0.05}
      clearcoat={1}
      attenuationDistance={2.5}
      attenuationColor={dark ? "#dbeafe" : "#ffffff"}
      color={dark ? "#eef4ff" : "#ffffff"}
    />
  ) : (
    <meshPhysicalMaterial
      color={dark ? "#cfd8e6" : "#e9eef5"}
      roughness={0.08}
      metalness={0}
      clearcoat={1}
      clearcoatRoughness={0.05}
      envMapIntensity={1.6}
      transparent
      opacity={0.92}
    />
  );

  return (
    <>
      <group ref={backdrop}>
        <Backdrop dark={dark} fade={fade} />
      </group>
      <group ref={root} scale={ready ? scale : 0}>
        <group ref={glass}>
          {layout.out.map((l) => (
            <group key={l.i} ref={(el) => { refs.current[l.i] = el; }} position={[l.x, l.y + 7, 0]}>
              <Center top>
                <Text3D
                  font={FONT}
                  size={SIZE}
                  height={DEPTH}
                  curveSegments={full ? 10 : 5}
                  bevelEnabled
                  bevelThickness={0.07}
                  bevelSize={0.045}
                  bevelSegments={full ? 5 : 2}
                >
                  {l.ch}
                  {material}
                </Text3D>
              </Center>
            </group>
          ))}
        </group>
      </group>
    </>
  );
}

export default function LoaderLetters({ leaving }: { leaving: boolean }) {
  return (
    <View className="absolute inset-0">
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={35} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 6]} intensity={1.6} />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 4, 4]} scale={[10, 2, 1]} />
        <Lightformer form="rect" intensity={2} position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[8, 2, 1]} />
        <Lightformer form="ring" intensity={2.5} position={[4, 1, 3]} scale={2} />
      </Environment>
      <Suspense fallback={null}>
        <Letters leaving={leaving} />
      </Suspense>
    </View>
  );
}
