"use client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { initQuality, useQuality } from "@/lib/quality";
import { setStage, track, type SceneKey } from "@/lib/stage";
import Loader from "./Loader";

const Stage = dynamic(() => import("./three/Stage"), { ssr: false });

function sceneFor(path: string): SceneKey {
  if (path === "/") return "home";
  const p = path.split("/")[1];
  const map: Record<string, SceneKey> = {
    work: "work", models: "models", games: "games", about: "about",
    certificates: "certificates", blogs: "blog", contact: "contact",
  };
  return map[p] ?? "none";
}

export default function Shell({ children }: { children: React.ReactNode }) {
  const { quality, ready } = useQuality();
  const path = usePathname();

  useEffect(() => initQuality(), []);
  // The loader waits for the loader letters and the first screen's main 3D moment.
  useEffect(() => {
    if (!ready || quality === "off") return;
    track("loader");
    if (path === "/") track("hero");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);
  useEffect(() => {
    setStage({ scene: sceneFor(path) });
    window.scrollTo(0, 0);
  }, [path]);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
        setStage({ scroll: Math.min(1, scrollY / max) });
      });
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.quality = ready ? quality : "pending";
  }, [quality, ready]);

  return (
    <>
      {ready && quality !== "off" && <Stage />}
      <Loader />
      {children}
    </>
  );
}
