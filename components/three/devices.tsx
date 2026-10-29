"use client";
// Laptop and phone used by the hero and the project showcase. Screens show real screenshots.
import { RoundedBox, useTexture } from "@react-three/drei";
import { forwardRef, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export function roundedRect(w: number, h: number, r: number, seg = 6) {
  const s = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  const g = new THREE.ShapeGeometry(s, seg);
  // Map UVs to 0..1 across the rectangle.
  const p = g.attributes.position as THREE.BufferAttribute;
  const uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) {
    uv[i * 2] = (p.getX(i) - x) / w;
    uv[i * 2 + 1] = (p.getY(i) - y) / h;
  }
  g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  return g;
}

function useScreen(url: string) {
  const tex = useTexture(url);
  useLayoutEffect(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    tex.needsUpdate = true;
  }, [tex]);
  return tex;
}

export function Screen({ url, w, h, r }: { url: string; w: number; h: number; r: number }) {
  const tex = useScreen(url);
  const geo = useMemo(() => roundedRect(w, h, r), [w, h, r]);
  return (
    <mesh geometry={geo}>
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
}

type DeviceProps = JSX.IntrinsicElements["group"] & { screen: string; dark?: boolean };

const KEYS_X = 13, KEYS_Z = 5;

export const Laptop = forwardRef<THREE.Group, DeviceProps & { open?: number }>(function Laptop({ screen, dark, open = 1, ...rest }, ref) {
  const lid = useRef<THREE.Group>(null);
  const keys = useRef<THREE.InstancedMesh>(null);
  const body = dark ? "#2b2d31" : "#c8ccd2";
  const W = 3.2, D = 2.15, T = 0.11;

  useLayoutEffect(() => {
    const m = keys.current;
    if (!m) return;
    const o = new THREE.Object3D();
    let i = 0;
    for (let z = 0; z < KEYS_Z; z++)
      for (let x = 0; x < KEYS_X; x++) {
        o.position.set(-1.32 + x * 0.22, T / 2 + 0.006, -0.82 + z * 0.215);
        o.scale.set(1, 1, 1);
        o.updateMatrix();
        m.setMatrixAt(i++, o.matrix);
      }
    m.instanceMatrix.needsUpdate = true;
  }, []);

  useLayoutEffect(() => {
    if (lid.current) lid.current.rotation.x = Math.PI / 2 - open * (Math.PI / 2 + 0.28);
  }, [open]);

  return (
    <group ref={ref} {...rest}>
      {/* Base */}
      <RoundedBox args={[W, T, D]} radius={0.05} smoothness={4}>
        <meshStandardMaterial color={body} metalness={0.65} roughness={0.32} />
      </RoundedBox>
      <instancedMesh ref={keys} args={[undefined, undefined, KEYS_X * KEYS_Z]}>
        <boxGeometry args={[0.18, 0.018, 0.18]} />
        <meshStandardMaterial color={dark ? "#111214" : "#1d1e21"} roughness={0.7} />
      </instancedMesh>
      <mesh position={[0, T / 2 + 0.002, 0.62]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[1.1, 0.62]} />
        <meshStandardMaterial color={dark ? "#323439" : "#b9bdc4"} metalness={0.5} roughness={0.25} />
      </mesh>
      {/* Lid hinges at the back edge */}
      <group ref={lid} position={[0, T / 2, -D / 2 + 0.02]}>
        <group position={[0, (D - 0.04) / 2, 0]}>
          <RoundedBox args={[W, D - 0.04, 0.07]} radius={0.04} smoothness={4} position={[0, 0, -0.035]}>
            <meshStandardMaterial color={body} metalness={0.65} roughness={0.32} />
          </RoundedBox>
          <mesh position={[0, 0, 0.002]}>
            <planeGeometry args={[W - 0.08, D - 0.12]} />
            <meshStandardMaterial color="#050505" roughness={0.2} />
          </mesh>
          <group position={[0, 0.03, 0.004]}>
            <Screen url={screen} w={W - 0.26} h={(W - 0.26) * 0.5605} r={0.03} />
          </group>
        </group>
      </group>
    </group>
  );
});

export const Phone = forwardRef<THREE.Group, DeviceProps>(function Phone({ screen, dark, ...rest }, ref) {
  const W = 0.8, H = 1.68;
  const glassGeo = useMemo(() => roundedRect(W - 0.04, H - 0.04, 0.1), []);
  return (
    <group ref={ref} {...rest}>
      <RoundedBox args={[W, H, 0.085]} radius={0.04} smoothness={4}>
        <meshStandardMaterial color={dark ? "#1c1d20" : "#2a2b2f"} metalness={0.7} roughness={0.28} />
      </RoundedBox>
      <group position={[0, 0, 0.0435]}>
        <mesh geometry={glassGeo}>
          <meshStandardMaterial color="#030303" roughness={0.15} />
        </mesh>
        <group position={[0, 0, 0.001]}>
          <Screen url={screen} w={W - 0.08} h={H - 0.08} r={0.085} />
        </group>
        <mesh position={[0, H / 2 - 0.1, 0.002]}>
          <circleGeometry args={[0.022, 16]} />
          <meshBasicMaterial color="#000" />
        </mesh>
      </group>
    </group>
  );
});
