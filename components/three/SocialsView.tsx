"use client";
// Footer socials: same-size rounded tiles threaded on one cord. They sway together
// and the one you hover or focus jumps. The real links are the HTML tiles on top.
import { Environment, Lightformer, OrthographicCamera, RoundedBox, View } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { icons } from "@/content/icons";
import { socials } from "@/content/site";
import { getStage } from "@/lib/stage";
import { useDark } from "@/lib/theme";
import { useQuality } from "@/lib/quality";
import { useShown, useWarm } from "./useWarm";

const GAP = 8;

export function iconGeometry(path: string, depth = 3) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${path}" fill-rule="evenodd"/></svg>`;
  const data = new SVGLoader().parse(svg);
  const shapes = data.paths.flatMap((p) => SVGLoader.createShapes(p));
  const g = new THREE.ExtrudeGeometry(shapes, { depth, bevelEnabled: true, bevelThickness: 0.4, bevelSize: 0.25, bevelSegments: 2, curveSegments: 6 });
  // Flip from SVG (y down) to 3D (y up) with a rotation, not a negative scale, so faces stay outward.
  g.translate(-12, -12, 0);
  g.rotateX(Math.PI);
  g.translate(0, 0, depth);
  g.computeVertexNormals();
  return g;
}

function Tiles({ count }: { count: number }) {
  const { size } = useThree();
  const dark = useDark();
  const { quality } = useQuality();
  const cols = size.width < 640 ? 4 : 8;
  const cell = (size.width - GAP * (cols - 1)) / cols;
  const rows = Math.ceil(count / cols);
  const pos = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        return new THREE.Vector3(-size.width / 2 + c * (cell + GAP) + cell / 2, size.height / 2 - r * (cell + GAP) - cell / 2, 0);
      }),
    [count, cols, cell, size.width, size.height],
  );
  const geos = useMemo(() => socials.map((s) => iconGeometry(icons[s.key])), []);
  const tiles = useRef<(THREE.Group | null)[]>([]);
  const springs = useRef(socials.map(() => ({ y: 0, v: 0, r: 0 })));
  const cords = useRef<(THREE.Mesh | null)[]>([]);
  const t = useRef(0);
  const ready = useWarm("socials");
  const shown = useShown(ready);

  const tileSize = cell * 0.74;
  const iconScale = (tileSize * 0.5) / 24;

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 1 / 30);
    t.current += dt;
    const focus = getStage().focus;
    springs.current.forEach((s, i) => {
      const hot = focus === "social:" + socials[i].key;
      const target = hot ? cell * 0.12 : Math.sin(t.current * 1.6 + i * 0.7) * cell * 0.02;
      const a = (target - s.y) * 90 - s.v * 9;
      s.v += a * dt;
      s.y += s.v * dt;
      s.r = THREE.MathUtils.lerp(s.r, hot ? Math.sin(t.current * 9) * 0.12 : Math.sin(t.current * 1.6 + i * 0.7) * 0.05, 0.1);
      const g = tiles.current[i];
      if (g) {
        g.position.set(pos[i].x, pos[i].y + s.y, 0);
        g.rotation.set(-s.v / cell * 0.04, s.r, s.r * 0.6);
      }
    });
    // Rebuild the cord through the tile centres for each row.
    for (let r = 0; r < rows; r++) {
      const m = cords.current[r];
      if (!m) continue;
      const idx = Array.from({ length: cols }, (_, c) => r * cols + c).filter((i) => i < count);
      const pts: THREE.Vector3[] = [new THREE.Vector3(-size.width / 2 - 20, pos[idx[0]].y + 6, -tileSize * 0.1)];
      idx.forEach((i, k) => {
        pts.push(new THREE.Vector3(pos[i].x, pos[i].y + springs.current[i].y, -tileSize * 0.1));
        const j = idx[k + 1];
        if (j !== undefined) {
          const midY = (pos[i].y + springs.current[i].y + pos[j].y + springs.current[j].y) / 2 - cell * 0.08;
          pts.push(new THREE.Vector3((pos[i].x + pos[j].x) / 2, midY, -tileSize * 0.1));
        }
      });
      pts.push(new THREE.Vector3(size.width / 2 + 20, pos[idx[idx.length - 1]].y + 6, -tileSize * 0.1));
      const curve = new THREE.CatmullRomCurve3(pts);
      m.geometry.dispose();
      m.geometry = new THREE.TubeGeometry(curve, idx.length * 10, Math.max(1.2, cell * 0.012), 6, false);
    }
  });

  const tileColor = dark ? "#1b1b1d" : "#ffffff";
  const ink = dark ? "#f5f5f5" : "#0b0b0b";
  return (
    <group scale={shown ? 1 : 0.0001}>
      {Array.from({ length: rows }, (_, r) => (
        <mesh key={r} ref={(m) => { cords.current[r] = m; }}>
          <bufferGeometry />
          <meshStandardMaterial color={dark ? "#777" : "#222"} roughness={0.6} />
        </mesh>
      ))}
      {socials.map((s, i) => (
        <group key={s.key} ref={(g) => { tiles.current[i] = g; }} position={pos[i]}>
          <RoundedBox args={[tileSize, tileSize, tileSize * 0.28]} radius={tileSize * 0.18} smoothness={quality === "full" ? 5 : 3}>
            <meshPhysicalMaterial color={tileColor} roughness={0.25} clearcoat={1} clearcoatRoughness={0.1} envMapIntensity={1.2} />
          </RoundedBox>
          <mesh geometry={geos[i]} scale={[iconScale, iconScale, iconScale * 1.2]} position={[0, 0, tileSize * 0.14]}>
            <meshStandardMaterial color={ink} roughness={0.35} metalness={0.1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function SocialsView({ count }: { count: number }) {
  return (
    <View className="absolute inset-0">
      <OrthographicCamera makeDefault position={[0, 0, 500]} zoom={1} near={1} far={2000} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[200, 400, 600]} intensity={1.4} />
      <Environment resolution={64} frames={1}>
        <Lightformer form="rect" intensity={2.5} position={[0, 3, 4]} scale={[10, 2, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[-4, -1, 3]} scale={[6, 2, 1]} />
      </Environment>
      <Tiles count={count} />
    </View>
  );
}
