"use client";

/* Real 3D devices for the landing page (devices3d/stage.ts): a midnight laptop whose lid opens on a hinge and a
   phone with a metal frame, Dynamic Island, buttons and camera, showing the app's real screens. She can turn them
   with a drag, spin them with a tap, and watch the keys go down as she types.
   Light on the device: the 3D is only built when the section comes near the screen and is freed again when it
   is far away, so at most one or two are alive at a time. If the browser cannot draw 3D, the flat picture passed
   as `fallback` is shown instead. */
import { useEffect, useRef, useState, type ReactNode } from "react";

export type Scene = "hero" | "phones" | "safety";

export function Devices3D({ scene, className = "", fallback }: { scene: Scene; className?: string; fallback: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "ready" | "failed">("idle");

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let stop: (() => void) | null = null;
    let token = 0;
    const start = () => {
      if (stop) return;
      const my = ++token;
      let cleanup = () => {};
      stop = () => {
        token++;
        cleanup();
        stop = null;
      };
      import("./stage")
        .then(({ mount }) => {
          if (my !== token) return;
          cleanup = mount(
            el,
            scene,
            () => my === token && setState("ready"),
            () => {
              stop?.();
              setState("failed");
            },
          );
        })
        .catch(() => my === token && setState("failed"));
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) start();
        else if (stop) {
          stop();
          setState("idle");
        }
      },
      { rootMargin: "50% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stop?.();
    };
  }, [scene]);

  if (state === "failed") return <>{fallback}</>;
  return (
    <div
      ref={box}
      className={`relative select-none transition-opacity duration-700 ${state === "ready" ? "opacity-100" : "opacity-0"} ${className}`}
      role="img"
      aria-label={
        scene === "phones"
          ? "Projects on two phones. Drag to turn them, tap to spin them round."
          : "Emmanuel's projects on a laptop and a phone. Drag to turn them, tap to spin them round."
      }
    />
  );
}
