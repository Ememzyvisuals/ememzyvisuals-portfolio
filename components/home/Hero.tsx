"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { profile } from "@/content/site";
import { useThreeOn } from "@/lib/theme";
import { Arrow } from "@/components/ui";

const HeroView = dynamic(() => import("@/components/three/HeroView"), { ssr: false });

export default function Hero() {
  const three = useThreeOn();
  const ref = useRef<HTMLElement>(null);
  return (
    <section ref={ref} id="top" className="relative min-h-[100svh] overflow-hidden pt-24 lg:pt-0" aria-label="Introduction">
      <div className="page relative grid min-h-[calc(100svh-6rem)] items-center gap-6 lg:min-h-[100svh] lg:grid-cols-[1.05fr_1fr]">
        <div className="relative order-2 pb-16 lg:order-1 lg:pb-0">
          <p className="kicker">ML Engineer at PlotWeaver · Founder of Axiveri</p>
          <h1 className="mt-4 font-display text-[clamp(3.1rem,11vw,7.6rem)] font-extrabold leading-[0.88] tracking-[-0.05em]">
            Emmanuel<br />Ariyo
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg/80 sm:text-xl">{profile.headline}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {profile.roles.map((r) => (
              <li key={r} className="tag">{r}</li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="#work" className="btn-solid">See my work <Arrow /></Link>
            <Link href="/contact" className="btn-ghost">Work with me</Link>
          </div>
        </div>
        <div className="relative order-1 h-[44svh] min-h-[280px] lg:order-2 lg:h-[78svh]">
          {three ? (
            <div className="absolute -inset-x-[6%] -inset-y-[4%] lg:left-0 lg:-right-[14%]"><HeroView anchor={ref} /></div>
          ) : (
            <div className="absolute inset-0 grid place-items-center">
              <div className="w-[88%] rounded-[18px] border-[10px] border-fg/90 bg-fg/90 shadow-2xl">
                <Image src="/images/projects/claudgpt-web.png" alt="ClaudGPT running in a browser" width={1366} height={766} className="rounded-md" priority />
              </div>
            </div>
          )}
        </div>
      </div>
      <a href="#what" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-xs font-medium text-muted hover:text-fg lg:block">
        Scroll
      </a>
    </section>
  );
}
