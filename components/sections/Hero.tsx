// components/sections/Hero.tsx
// The opening screen, after the character-slider reference: a huge name in the site's condensed type across the
// screen, my 3D character (a short looping video on black) standing in front of it so his head and shoulders cover the
// middle letters, and what I do with the way to reach me along the bottom. The section is pure black like the video,
// and the video's sides fade into it, so the letters show again on either side of him.
import Link from "next/link";
import { VisitorCounter } from "@/components/ui/VisitorCounter";

export function Hero() {
  return (
    <section aria-label="Introduction" className="hero-stage relative overflow-hidden bg-black text-white">
      <div className="relative mx-auto flex min-h-[min(100svh,1000px)] max-w-[2400px] flex-col justify-end">
        {/* the name, behind */}
        <h1
          className="hero-word pointer-events-none absolute inset-x-0 top-[18%] select-none text-center font-anton uppercase md:top-[14%]"
          style={{ fontSize: "clamp(5rem, 21vw, 24rem)", lineHeight: 0.86, fontWeight: 400 }}
        >
          <span className="sr-only">Hi, I&apos;m </span>Emmanuel
        </h1>

        {/* me, in front */}
        <div className="hero-me pointer-events-none absolute inset-x-0 bottom-0 top-[10%] flex justify-center">
          <video
            className="h-full w-auto max-w-none object-cover"
            src="/images/me/hero.mp4"
            poster="/images/me/hero.webp"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label="My 3D character, standing and looking around"
          />
        </div>

        {/* what I do, and the way in */}
        <div className="container-padded relative z-10 grid gap-6 pb-10 pt-[70svh] md:grid-cols-2 md:items-end md:pb-14 md:pt-0">
          <div className="hero-rise max-w-[26rem]" style={{ animationDelay: "250ms" }}>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-white/55">Machine learning engineer</p>
            <p className="mt-3 text-[17px] font-semibold leading-relaxed text-white/85">
              I build speech and language AI for African languages, and the web products that put it in people&apos;s hands.
            </p>
          </div>
          <div className="hero-rise flex flex-col gap-5 md:items-end" style={{ animationDelay: "380ms" }}>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">Get in touch</Link>
              <Link href="/work" className="btn-outline !border-white/30 !text-white hover:!bg-white/10">See my work</Link>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <Link href="/axiveri" className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-white/80 hover:text-white">
                Founder of Axiveri
              </Link>
              <VisitorCounter />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
