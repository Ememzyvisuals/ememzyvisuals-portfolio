import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import { WorkClientPage } from "./WorkClientPage";

export const metadata: Metadata = buildMeta({
  title: "Portfolio — High-Quality Websites & AI Systems | Emmanuel Ariyo",
  description:
    "See the premium websites, SaaS platforms, AI systems, and automation tools built by Emmanuel Ariyo (Ememzyvisuals). Real projects, real users, real results.",
  path: "/work",
  ogTitle: "Emmanuel Ariyo's Work",
  ogSubtitle:
    "10+ production apps — websites, AI platforms & automation tools",
  ogTag: "Portfolio",
  tags: [
    "web developer portfolio Nigeria",
    "high quality website examples",
    "AI developer portfolio",
    "best Nigerian developer portfolio",
    "website development examples",
  ],
});

export default function WorkPage() {
  return <WorkClientPage />;
}
