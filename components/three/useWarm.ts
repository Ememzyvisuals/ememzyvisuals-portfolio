"use client";
// Compile a view's shaders off the main thread before showing it, so the first frame never freezes.
import { useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { finish, track, useStage } from "@/lib/stage";

export function useWarm(key: string, onDone?: () => void) {
  const { gl, scene, camera } = useThree();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    track(key);
    const done = () => {
      if (!alive) return;
      setReady(true);
      finish(key);
      onDone?.();
    };
    const id = requestAnimationFrame(() => {
      const r = gl as unknown as { compileAsync?: (s: unknown, c: unknown) => Promise<unknown> };
      if (r.compileAsync) r.compileAsync(scene, camera).then(done, done);
      else {
        gl.compile(scene, camera);
        done();
      }
    });
    return () => {
      alive = false;
      cancelAnimationFrame(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl, scene, camera]);
  return ready;
}

// Page moments stay hidden (but compiled) until the visitor is past the loader.
export function useShown(ready: boolean) {
  const entered = useStage((s) => s.entered);
  return ready && entered;
}
