import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import { ALL_PROJECTS } from "@/data/projects";
import { ProjectCard } from "@/components/ui/ProjectCard";

export const metadata: Metadata = buildMeta({
  title: "Premium Web Platforms & SaaS Products | Emmanuel Ariyo",
  description:
    "Full-scale SaaS platforms and web products built by Emmanuel Ariyo: ClaudGPT (AI dev tool), AethLife (life OS), FlonexTV (streaming), NaijaPrep (EdTech PWA), NairaNest (fintech).",
  path: "/platforms",
  ogTitle: "Premium Platforms Built by Emmanuel",
  ogSubtitle:
    "ClaudGPT · AethLife · FlonexTV · NaijaPrep · NairaNest",
  ogTag: "Platforms",
  tags: [
    "SaaS developer Nigeria",
    "web platform developer",
    "build SaaS product",
    "full stack platform developer",
    "premium web platforms Nigeria",
  ],
});

const PLATFORMS = ALL_PROJECTS.filter((p) =>
  ["claudgpt", "aethlife", "flonextv", "naijaprep", "studenthub-ng", "nairanest"].includes(
    p.slug ?? ""
  )
);

export default function PlatformsPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container-padded space-y-12">
        <div>
          <h1 className="section-heading">Platforms.</h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-xl">
            Full-scale platforms and SaaS products serving real users
            with production-ready infrastructure.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PLATFORMS.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
