import type { Metadata } from "next";
import Link from "next/link";
import { certificates, experience, principles, profile, story } from "@/content/site";
import { Arrow, SectionHead } from "@/components/ui";
import AboutHero from "@/components/work/AboutHero";

export const metadata: Metadata = {
  title: "About",
  description: "Emmanuel Ariyo is a self-taught Machine Learning Engineer from Nigeria, building speech AI for African languages, and the founder of Axiveri.",
};

export default function About() {
  return (
    <div className="pb-10 pt-28 sm:pt-36">
      <AboutHero />
      <section className="page mt-10 grid gap-10 lg:grid-cols-[1fr_1.4fr]" aria-labelledby="story-h">
        <h2 id="story-h" className="h-section">My story.</h2>
        <div className="space-y-6 text-lg leading-relaxed text-fg/85">
          {story.map((p) => <p key={p.slice(0, 20)}>{p}</p>)}
        </div>
      </section>
      <section className="page mt-24" aria-labelledby="how-h">
        <SectionHead id="how-h" kicker="How I work" title="Four rules I keep." />
        <div className="grid gap-4 sm:grid-cols-2">
          {principles.map((p, i) => (
            <div key={p.title} className="glass rounded-xl3 p-6">
              <span className="font-display text-sm font-bold text-muted">0{i + 1}</span>
              <h3 className="mt-3 text-2xl font-bold">{p.title}</h3>
              <p className="mt-2 text-fg/75">{p.body}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="page mt-24" aria-labelledby="xp-h">
        <SectionHead id="xp-h" kicker="Experience" title="Roles." />
        <ol className="space-y-4">
          {experience.map((e) => (
            <li key={e.company} className="glass rounded-xl3 p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-2xl font-bold">{e.role}, {e.company}</h3>
                <p className="text-sm text-muted">{e.period} · {e.mode}</p>
              </div>
              <p className="mt-2 text-fg/75">{e.summary}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="page mt-24">
        <div className="glass flex flex-col items-start justify-between gap-6 rounded-xl3 p-6 sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="text-3xl font-bold">{certificates.length} certificates, all verifiable.</h2>
            <p className="mt-2 text-fg/75">Kaggle and IBM SkillsBuild courses, each with what it taught me.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/certificates" className="btn-solid">See certificates <Arrow /></Link>
            <a href={profile.cv} className="btn-ghost" download>Download CV</a>
          </div>
        </div>
      </section>
    </div>
  );
}
