// components/sections/Hero.tsx
// Two-column hero: name, role and actions on the left, the illustration slot on the right.
// Drop an illustration into public/illustrations/hero.(webp|png|jpg|svg) and it is used on the next build;
// until then HeroArt shows its own geometric composition.
import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { HeroArt } from "./HeroArt";
import { VisitorCounter } from "@/components/ui/VisitorCounter";

function findIllustration(): string | null {
  for (const ext of ["webp", "png", "jpg", "svg"]) {
    try {
      if (fs.existsSync(path.join(process.cwd(), "public", "illustrations", `hero.${ext}`))) return `/illustrations/hero.${ext}`;
    } catch {}
  }
  return null;
}

export function Hero() {
  const art = findIllustration();
  return (
    <section aria-label="Introduction" className="relative pt-28 pb-section-sm md:pt-36 lg:min-h-[min(100svh,960px)] lg:flex lg:items-center">
      <div className="container-padded grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7 xl:col-span-6">
          <p className="hero-rise inline-flex items-center gap-2.5 rounded-full border border-border bg-card px-4 py-1.5 text-caption font-semibold text-foreground">
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inset-0 rounded-full bg-sun" />
            </span>
            Available for new projects
          </p>

          <h1 className="hero-rise mt-7 text-display" style={{ animationDelay: "80ms" }}>
            Emmanuel Ariyo
          </h1>

          <p className="hero-rise mt-7 max-w-[36rem] text-lead text-muted-foreground" style={{ animationDelay: "160ms" }}>
            Machine learning engineer and full-stack developer from Nigeria. I build speech and language AI for
            African languages, and the web products that put it in people&apos;s hands.
          </p>

          <div className="hero-rise mt-9 flex flex-wrap items-center gap-3" style={{ animationDelay: "240ms" }}>
            <Link href="/contact" className="btn-primary">Get in touch</Link>
            <Link href="/work" className="btn-outline">See my work</Link>
          </div>

          <dl className="hero-rise mt-12 grid max-w-[36rem] grid-cols-2 gap-6 border-t border-border pt-6" style={{ animationDelay: "320ms" }}>
            <div>
              <dt className="text-caption font-semibold text-muted-foreground">Now</dt>
              <dd className="mt-1 text-small font-semibold text-foreground">ML engineer, speech AI at PlotWeaver</dd>
            </div>
            <div>
              <dt className="text-caption font-semibold text-muted-foreground">Also</dt>
              <dd className="mt-1 text-small font-semibold text-foreground">
                Founder of <Link href="/axiveri" className="link-quiet">Axiveri</Link>, an open model lab
              </dd>
            </div>
          </dl>
          <div className="mt-6"><VisitorCounter /></div>
        </div>

        <div className="lg:col-span-5 lg:col-start-8 xl:col-span-5 xl:col-start-8">
          <HeroArt src={art} />
        </div>
      </div>
    </section>
  );
}
