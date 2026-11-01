import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import { ProjectsShowcase } from "@/components/sections/ProjectsShowcase";
import { OpenModels } from "@/components/sections/OpenModels";
import { AutomationSection } from "@/components/sections/Automation";
import { GamesSection } from "@/components/sections/Games";

export const metadata: Metadata = buildMeta({
  title: "Work: products, open models, automation and games | Emmanuel Ariyo",
  description:
    "Live products on their own screens, open speech and language models for African languages, AI automation and browser games, built by Emmanuel Ariyo.",
  path: "/work",
  ogTitle: "Emmanuel Ariyo's Work",
  ogSubtitle: "Products, open models, automation and games",
  ogTag: "Work",
  tags: ["AI engineer portfolio", "speech AI African languages", "Nigerian developer portfolio", "open source models"],
});

const divider = (
  <div className="container-padded">
    <div className="section-divider" />
  </div>
);

// Same sections as the landing page, so /work and the home page always match.
export default function WorkPage() {
  return (
    <div className="pt-24">
      <ProjectsShowcase showAll={false} />
      {divider}
      <OpenModels />
      {divider}
      <AutomationSection />
      {divider}
      <GamesSection />
    </div>
  );
}
