"use client";
// Games page: Mama Titi from Bùkà Hustle, my own rigged character. She greets you,
// then goes back to stirring her pot. She turns a little toward the pointer.
import { ContactShadows, Environment, Lightformer, PerspectiveCamera, View, useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { useDark } from "@/lib/theme";
import { useShown, useWarm } from "./useWarm";

const TITI = "/models/mama_titi.glb";

function Titi() {
  const dark = useDark();
  const root = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(TITI, false, true);
  const { actions, mixer } = useAnimations(animations, root);
  const ready = useWarm("titi");
  const shown = useShown(ready);

  useEffect(() => {
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) m.frustumCulled = false;
    });
  }, [scene]);

  useEffect(() => {
    if (!shown) return;
    const greet = actions.Greet;
    const idle = actions.Stir ?? actions.Idle;
    if (!greet || !idle) {
      (idle ?? greet)?.play();
      return;
    }
    greet.reset().setLoop(THREE.LoopOnce, 1).fadeIn(0.2).play();
    greet.clampWhenFinished = true;
    const done = () => {
      greet.fadeOut(0.4);
      idle.reset().fadeIn(0.4).play();
    };
    mixer.addEventListener("finished", done);
    return () => mixer.removeEventListener("finished", done);
  }, [shown, actions, mixer]);

  useFrame(({ pointer }) => {
    if (root.current) root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, 0.35 + pointer.x * 0.35, 0.05);
  });

  return (
    <>
    {shown && <ContactShadows position={[0, -1, 0]} opacity={dark ? 0.6 : 0.35} scale={5} blur={2.2} far={2} frames={Infinity} resolution={256} />}
    <group scale={shown ? 1 : 0.0001}>
      <group ref={root} position={[0, -1, 0]}>
        <primitive object={scene} />
      </group>
    </group>
    </>
  );
}

export default function MamaTitiView() {
  return (
    <View className="absolute inset-0">
      <PerspectiveCamera makeDefault position={[0, 0.05, 3.9]} fov={30} onUpdate={(c) => c.lookAt(0, -0.12, 0)} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[2, 4, 3]} intensity={1.8} />
      <Environment resolution={64} frames={1}>
        <Lightformer form="rect" intensity={2.4} position={[0, 4, 3]} scale={[8, 2, 1]} color="#ffe2b8" />
        <Lightformer form="rect" intensity={1.2} position={[-4, 1, 1]} rotation-y={Math.PI / 2} scale={[5, 2, 1]} />
      </Environment>
      <Suspense fallback={null}>
        <Titi />
      </Suspense>
    </View>
  );
}
