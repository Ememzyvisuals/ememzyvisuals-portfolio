import "server-only";
import { certificates, experience, games, models, pillars, principles, profile, projects, research, socials, stack, story } from "@/content/site";
import { getPosts } from "./blog";

// The whole site as clean Markdown for AI agents and text-only readers. No 3D, no scripts.
export async function siteMarkdown(full: boolean) {
  const posts = await getPosts();
  const u = profile.url;
  const L: string[] = [];
  L.push(`# ${profile.name} (${profile.handle})`, "", `> ${profile.title} at PlotWeaver. Founder of Axiveri. Based in ${profile.location}.`, "", profile.short, "", profile.available, "", `Email: ${profile.email}`, "");
  L.push("## What I do", ...pillars.map((p) => `- **${p.title}:** ${p.body}`), "");
  L.push("## Experience", ...experience.flatMap((e) => [`### ${e.role}, ${e.company} (${e.period}, ${e.mode})`, e.summary, ...e.points.map((x) => `- ${x}`), ""]));
  L.push("## Open models (Axiveri)", ...models.flatMap((m) => [`### ${m.name}: ${m.kind}`, m.line, ...(full ? m.details.map((d) => `- ${d}`) : []), `- Link: ${m.link}`, ...(m.extraLinks ?? []).map((l) => `- ${l.label}: ${l.href}`), ""]));
  L.push(`### ${research.name}: benchmark`, research.line, ...(full ? [research.body] : []), ...research.links.map((l) => `- ${l.label}: ${l.href}`), "");
  L.push("## Games", ...games.flatMap((g) => [`### ${g.name} (${g.genre})`, g.line, ...(full ? [g.body] : []), `- Play: ${g.play}`, ...g.links.map((l) => `- ${l.label}: ${l.href}`), ""]));
  L.push("## Projects", ...projects.flatMap((p) => [`### ${p.name} (${p.group})`, p.line, ...(full ? [`Problem: ${p.problem}`, ...p.features.map((f) => `- ${f}`), `Stack: ${p.stack.join(", ")}`] : []), ...(p.live ? [`- Live: ${p.live}`] : []), ...(p.repo ? [`- Code: ${p.repo}`] : []), `- Case study: ${u}/work/${p.slug}`, ""]));
  L.push("## Tech stack", ...stack.map((s) => `- **${s.group}:** ${s.items.join(", ")}`), "");
  L.push("## Certificates", ...certificates.map((c) => `- ${c.course} (${c.issuer}). ${full ? c.taught + " " : ""}Skills: ${c.skills.join(", ")}. Verify: ${c.verify}`), "");
  if (full) L.push("## About", ...story, "", "### How I work", ...principles.map((p) => `- **${p.title}:** ${p.body}`), "");
  L.push("## Writing", ...posts.map((p) => `- [${p.title}](${u}/blogs/${p.slug}) (${p.date}): ${p.excerpt}`), "");
  if (full) for (const p of posts) L.push(`---`, "", `## ${p.title}`, `*${p.dateLabel}. ${u}/blogs/${p.slug}*`, "", p.body.trim(), "");
  L.push("## Links", ...socials.map((s) => `- ${s.label}: ${s.href}`), `- Full text version: ${u}/llms-full.txt`, "");
  return L.join("\n");
}
