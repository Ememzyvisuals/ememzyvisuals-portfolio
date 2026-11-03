// components/sections/Hero.tsx
// The opening screen: the name in the site's big condensed type, what I do and the way to reach me on the left,
// the adire pattern tiles on the right (stacked on phones). No 3D scene.
import Link from "next/link";
import { HeroArt } from "./HeroArt";
import { VisitorCounter } from "@/components/ui/VisitorCounter";

export function Hero() {
  return (
    <section aria-label="Introduction" className="tone-blue relative pt-28 pb-section md:pt-36 lg:flex lg:min-h-[min(100svh,980px)] lg:items-center">
      <div className="container-padded grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <h1
            className="hero-rise font-anton uppercase text-foreground"
            style={{ fontWeight: 400, fontSize: "clamp(4rem, 10.5vw, 10rem)", lineHeight: 0.95, letterSpacing: "0" }}
          >
            Hi, I&apos;m
            <br />
            Emmanuel
          </h1>

          <p className="hero-rise mt-7 max-w-[34rem] text-lead text-muted-foreground" style={{ animationDelay: "120ms" }}>
            Machine learning engineer and full-stack developer from Nigeria, building speech and language AI for
            African languages, and the web products that put it in people&apos;s hands.
          </p>

          <div className="hero-rise mt-9 flex flex-wrap items-center gap-3" style={{ animationDelay: "220ms" }}>
            <Link href="/contact" className="btn-primary">Get in touch</Link>
            <Link href="/work" className="btn-outline">See my work</Link>
          </div>

          <div className="hero-rise mt-9 flex flex-wrap items-center gap-x-6 gap-y-3" style={{ animationDelay: "300ms" }}>
            <Link
              href="/axiveri"
              className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground hover:text-brand transition-colors"
            >
              Founder of Axiveri
            </Link>
            <VisitorCounter />
          </div>
        </div>

        <div className="lg:col-span-5">
          <HeroArt />
        </div>
      </div>
    </section>
  );
}
