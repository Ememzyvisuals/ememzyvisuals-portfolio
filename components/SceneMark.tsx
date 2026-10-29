"use client";
// Lets a page tell the 3D stage which scene it is (used for page-level 3D backdrops).
import { useEffect } from "react";
import { setStage, type SceneKey } from "@/lib/stage";
export default function SceneMark({ scene }: { scene: SceneKey }) {
  useEffect(() => setStage({ scene }), [scene]);
  return null;
}
