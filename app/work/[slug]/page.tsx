import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/content/site";
import { Arrow, Ext, Tags } from "@/components/ui";
import { DeviceStage } from "@/components/home/ProjectShowcase";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = projects.find((x) => x.slug === params.slug);
  if (!p) return {};
  return { title: p.name, description: p.line, alternates: { canonical: `/work/${p.slug}` }, openGraph: { images: p.web ? [p.web] : undefined } };
}

export default function CaseStudy({ params }: { params: { slug: string } }) {
  const i = projects.findIndex((x) => x.slug === params.slug);
  if (i < 0) notFound();
  const p = projects[i];
  const next = projects[(i + 1) % projects.length];
  return (
    <article className="pb-10 pt-28 sm:pt-36">
      <div className="page">
        <Link href="/work" className="text-sm font-medium text-muted hover:text-fg">All work</Link>
        <p className="kicker mt-8">{p.group}</p>
        <h1 className="mt-3 font-display text-[clamp(2.8rem,9vw,6rem)] font-extrabold leading-[0.92]">{p.name}</h1>
        <p className="mt-5 max-w-2xl text-xl text-fg/80">{p.line}</p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          {p.live && <a href={p.live} target="_blank" rel="noopener noreferrer" className="btn-solid">Open live <Arrow /></a>}
          {p.repo && <a href={p.repo} target="_blank" rel="noopener noreferrer" className="btn-ghost">Source code <Arrow /></a>}
          {p.extra?.map((l) => <Ext key={l.href} href={l.href} className="text-sm">{l.label}</Ext>)}
        </div>
      </div>
      <div className="page mt-10"><div className="glass overflow-hidden rounded-xl3"><DeviceStage p={p} /></div></div>
      <div className="page mt-14 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 className="text-2xl font-bold">The problem</h2>
          <p className="mt-3 text-lg text-fg/80">{p.problem}</p>
          <h2 className="mt-10 text-2xl font-bold">What it does</h2>
          <ul className="mt-4 space-y-3">
            {p.features.map((f) => (
              <li key={f} className="flex gap-3 text-fg/85"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-fg" />{f}</li>
            ))}
          </ul>
        </div>
        <aside className="glass h-fit rounded-xl3 p-6">
          <h2 className="kicker">Built with</h2>
          <Tags items={p.stack} className="mt-4" />
        </aside>
      </div>
      {(p.mobile?.length ?? 0) > 0 && (
        <div className="page mt-14">
          <h2 className="text-2xl font-bold">Screens</h2>
          <div className="no-scrollbar mt-5 flex gap-4 overflow-x-auto pb-2">
            {p.mobile!.map((m) => (
              <Image key={m} src={m} alt={`${p.name} screen`} width={300} height={650} className="h-[460px] w-auto shrink-0 rounded-3xl border border-line object-cover" />
            ))}
          </div>
        </div>
      )}
      <div className="page mt-20 border-t border-line pt-8">
        <Link href={`/work/${next.slug}`} className="group flex items-center justify-between gap-4">
          <span>
            <span className="kicker">Next project</span>
            <span className="mt-2 block font-display text-3xl font-extrabold group-hover:underline sm:text-5xl">{next.name}</span>
          </span>
          <Arrow className="h-8 w-8" />
        </Link>
      </div>
    </article>
  );
}
