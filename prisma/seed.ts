// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { ALL_PROJECTS } from "../data/projects";
import { knowledgeChunks } from "../data/contextChunks";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Seed Projects ─────────────────────────────────────────────────────────
  console.log("📦 Seeding projects...");
  for (const p of ALL_PROJECTS) {
    await prisma.project.upsert({
      where: { slug: p.slug! },
      update: {},
      create: {
        slug: p.slug!,
        title: p.title!,
        subtitle: p.subtitle!,
        description: p.description!,
        longDesc: p.longDesc ?? null,
        category: p.category ?? "WEB_APP",
        status: p.status ?? "COMPLETED",
        featured: p.featured ?? false,
        githubUrl: p.githubUrl ?? null,
        liveUrl: p.liveUrl ?? null,
        techStack: p.techStack ?? [],
        isMobilePrimary: p.isMobilePrimary ?? false,
        mobileImages: [],
        webImages: [],
        publishedAt: new Date(),
      },
    });
  }
  console.log(`✅ Seeded ${ALL_PROJECTS.length} projects`);

  // ─── Seed Knowledge Chunks ──────────────────────────────────────────────────
  console.log("🧠 Seeding knowledge chunks...");

  // Clear existing
  await prisma.knowledgeChunk.deleteMany();

  for (const chunk of knowledgeChunks) {
    await prisma.knowledgeChunk.create({
      data: {
        content: chunk.content,
        source: chunk.source,
      },
    });
  }
  console.log(`✅ Seeded ${knowledgeChunks.length} knowledge chunks`);

  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
