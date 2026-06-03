// app/about/page.tsx
import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import { AboutClient } from "./AboutClient";

export const metadata: Metadata = buildMeta({
  title: "About Emmanuel Ariyo | Ememzyvisuals",
  description:
    "Emmanuel Ariyo is a self-taught Creative Software Developer and AI Systems Engineer from Nigeria. Learn about his story, how he works, and what drives him.",
  path: "/about",
  ogTitle: "About Emmanuel Ariyo",
  ogSubtitle: "Self-taught developer · AI Engineer · Building from Nigeria",
  ogTag: "About",
  tags: ["Emmanuel Ariyo story", "self-taught developer Nigeria", "Ememzyvisuals about"],
});

export default function AboutPage() {
  return <AboutClient />;
}
