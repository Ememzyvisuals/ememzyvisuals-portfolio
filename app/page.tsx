import Image from "next/image";
import Link from "next/link";
import { certificates, experience, games, models, pillars, profile, projects, research, stack } from "@/content/site";
import { getPosts } from "@/lib/blog";
import { Arrow, Ext, More, SectionHead, Tags } from "@/components/ui";
import Hero from "@/components/home/Hero";
import ModelCards from "@/components/home/ModelCards";
import StackTags from "@/components/home/StackTags";
import ProjectShowcase from "@/components/home/ProjectShowcase";
import CertWall from "@/components/home/CertWall";

export const revalidate = 300;

export default async function Home() {
  const posts = (await getPosts()).slice(0, 3);
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured && p.kind !== "automation");
  const automation = projects.filter((p) => p.kind === "automation");

  return (
    <>
      <Hero />

      {/* What I do */}
      <section id="what" className="page py-24 sm:py-32" aria-labelledby="what-h">
        <SectionHead id="what-h" kicker="What I do" title={<>Three things,<br />one person.</>} />
        <div className="grid gap-4 md:grid-cols-3">
          {pillars.map((p, i) => (
            <article key={p.key} className="glass flex flex-col rounded-xl3 p-6 sm:p-8">
              <span className="font-display text-sm font-bold text-muted">0{i + 1}</span>
              <h3 className="mt-6 text-2xl font-bold sm:text-3xl">{p.title}</h3>
              <p className="mt-3 flex-1 text-fg/75">{p.body}</p>
              <Tags items={p.tags} className="mt-6" />
            </article>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="page py-24 sm:py-32" aria-labelledby="exp-h">
        <SectionHead id="exp-h" kicker="Experience" title="Where I work now." />
        <ol className="space-y-4">
          {experience.map((e) => (
            <li key={e.company} className="glass rounded-xl3 p-6 sm:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-bold sm:text-3xl">{e.role}</h3>
                  <p className="mt-1 text-lg font-semibold text-fg/80">{e.company}</p>
                </div>
                <p className="text-sm font-medium text-muted">{e.period} · {e.mode}</p>
              </div>
              <p className="mt-4 max-w-3xl text-fg/75">{e.summary}</p>
              <ul className="mt-5 grid gap-x-8 gap-y-2 text-[15px] text-fg/80 md:grid-cols-2">
                {e.points.map((pt) => (
                  <li key={pt} className="flex gap-3"><span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-fg/50" />{pt}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      {/* Models */}
      <section id="models" className="page py-24 sm:py-32" aria-labelledby="models-h">
        <SectionHead
          id="models-h"
          kicker="Axiveri open models"
          title={<>Models I trained<br />and published.</>}
          sub="Open models for African languages, speech and images, built so other developers can use them and build on them."
        />
        <ModelCards models={models} />
        <article className="glass mt-4 grid gap-6 rounded-xl3 p-6 sm:p-8 md:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="kicker">Research</p>
            <h3 className="mt-3 text-3xl font-bold sm:text-4xl">{research.name}</h3>
            <p className="mt-3 text-lg">{research.line}</p>
            <p className="mt-3 text-fg/70">{research.body}</p>
            <div className="mt-6 flex flex-wrap gap-4">
              {research.links.map((l) => <Ext key={l.href} href={l.href}>{l.label}</Ext>)}
              <Link href={research.blog} className="inline-flex items-center gap-1.5 font-semibold hover:underline">Read the story <Arrow /></Link>
            </div>
          </div>
          <dl className="grid content-start gap-3 text-sm">
            <div className="rounded-2xl border border-line p-4"><dt className="text-muted">Questions</dt><dd className="font-display text-3xl font-extrabold">120</dd></div>
            <div className="rounded-2xl border border-line p-4"><dt className="text-muted">Tiers</dt><dd className="mt-1 font-semibold">{research.tiers.join(", ")}</dd></div>
            <div className="rounded-2xl border border-line p-4"><dt className="text-muted">Measures</dt><dd className="mt-1 font-semibold">{research.metrics.join(", ")}</dd></div>
          </dl>
        </article>
        <More href="/models">All models</More>
      </section>

      {/* Games */}
      <section id="games" className="page py-24 sm:py-32" aria-labelledby="games-h">
        <SectionHead id="games-h" kicker="Games" title={<>Games set<br />in Nigeria.</>} sub="Free browser games. No download, no forced ads." />
        <div className="grid gap-4 lg:grid-cols-2">
          {games.map((g) => (
            <article key={g.slug} className="glass group overflow-hidden rounded-xl3">
              <div className="relative aspect-[16/10] overflow-hidden" style={{ background: `radial-gradient(120% 120% at 30% 20%, ${g.tone}55, transparent 60%), hsl(var(--fg) / 0.9)` }}>
                {g.image ? (
                  <Image src={g.image} alt={`${g.name} key art`} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.03]" />
                ) : (
                  <div className="absolute inset-0 grid place-items-center">
                    <span className="font-display text-[clamp(3rem,10vw,6rem)] font-extrabold tracking-tight text-bg">{g.name}</span>
                  </div>
                )}
              </div>
              <div className="p-6 sm:p-8">
                <p className="kicker">{g.genre}</p>
                <h3 className="mt-2 text-3xl font-bold">{g.name}</h3>
                <p className="mt-2 text-lg">{g.line}</p>
                <p className="mt-3 text-fg/70">{g.body}</p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <a href={g.play} target="_blank" rel="noopener noreferrer" className="btn-solid">Play free <Arrow /></a>
                  {g.links.map((l) => <Ext key={l.href} href={l.href} className="text-sm">{l.label}</Ext>)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section id="work" className="page py-24 sm:py-32" aria-labelledby="work-h">
        <SectionHead id="work-h" kicker="Selected work" title={<>Products people<br />actually use.</>} />
        <ProjectShowcase projects={featured} />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rest.map((p) => (
            <Link key={p.slug} href={`/work/${p.slug}`} className="glass group flex flex-col rounded-xl3 p-5 transition hover:-translate-y-1">
              <p className="kicker">{p.group}</p>
              <h3 className="mt-2 text-xl font-bold">{p.name}</h3>
              <p className="mt-2 flex-1 text-sm text-fg/70">{p.line}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold">Case study <Arrow /></span>
            </Link>
          ))}
        </div>
        <h3 className="mb-4 mt-16 text-2xl font-bold">Automation</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {automation.map((p) => (
            <Link key={p.slug} href={`/work/${p.slug}`} className="glass group rounded-xl3 p-6 transition hover:-translate-y-1">
              <h4 className="font-display text-2xl font-bold">{p.name}</h4>
              <p className="mt-2 text-fg/75">{p.line}</p>
              <Tags items={p.stack} className="mt-5" />
            </Link>
          ))}
        </div>
        <More href="/work">All work</More>
      </section>

      {/* Stack */}
      <section id="stack" className="page py-24 sm:py-32" aria-labelledby="stack-h">
        <SectionHead id="stack-h" kicker="Tech stack" title="What I build with." />
        <StackTags groups={stack} />
      </section>

      {/* Certificates */}
      <section id="certificates" className="py-24 sm:py-32" aria-labelledby="certs-h">
        <div className="page">
          <SectionHead id="certs-h" kicker="Certificates" title={<>Courses I<br />completed.</>} sub="Every one links to its public verification page." />
        </div>
        <CertWall certificates={certificates} />
        <div className="page"><More href="/certificates">All certificates</More></div>
      </section>

      {/* Blog */}
      <section id="blog" className="page py-24 sm:py-32" aria-labelledby="blog-h">
        <SectionHead id="blog-h" kicker="Writing" title="From the blog." />
        <div className="grid gap-4 md:grid-cols-3">
          {posts.map((p) => (
            <Link key={p.slug} href={`/blogs/${p.slug}`} className="glass group flex flex-col rounded-xl3 p-6 transition hover:-translate-y-1">
              <p className="text-xs font-medium text-muted">{p.dateLabel} · {p.minutes} min read</p>
              <h3 className="mt-3 text-xl font-bold leading-snug">{p.title}</h3>
              <p className="mt-3 line-clamp-3 flex-1 text-sm text-fg/70">{p.excerpt}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold">Read <Arrow /></span>
            </Link>
          ))}
        </div>
        <More href="/blogs">All posts</More>
      </section>

      {/* About + contact */}
      <section id="contact" className="page py-24 sm:py-32" aria-labelledby="contact-h">
        <div className="glass grid gap-8 overflow-hidden rounded-xl3 p-6 sm:p-10 md:grid-cols-[auto_1fr] md:items-center">
          <Image src={profile.photo} alt={profile.name} width={220} height={220} className="h-40 w-40 rounded-3xl object-cover grayscale sm:h-52 sm:w-52" />
          <div>
            <p className="kicker">About</p>
            <h2 id="contact-h" className="mt-3 font-display text-[clamp(2rem,5vw,3.4rem)] font-extrabold">Self-taught, and shipping.</h2>
            <p className="mt-4 max-w-2xl text-fg/75">{profile.short}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-solid">Start a conversation <Arrow /></Link>
              <Link href="/about" className="btn-ghost">My story</Link>
              <a href={profile.cv} className="btn-ghost" download>Download CV</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
