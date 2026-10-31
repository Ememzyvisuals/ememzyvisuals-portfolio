// app/games/page.tsx: step inside my games in 3D, right here on the portfolio.
import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import { GamesPlayground } from "./GamesPlayground";

export const metadata: Metadata = buildMeta({
  title: "Games, Emmanuel Ariyo | Ememzyvisuals",
  description: "Step inside Bùkà Hustle and LAST BUS, two 3D browser games built by Emmanuel Ariyo, then play the full games.",
  path: "/games",
  ogTitle: "Games",
  ogSubtitle: "Bùkà Hustle and LAST BUS, in 3D",
  ogTag: "Games",
});

export default function GamesPage() {
  return <GamesPlayground />;
}
