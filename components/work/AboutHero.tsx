"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef } from "react";
import { profile } from "@/content/site";
import { useThreeOn } from "@/lib/theme";

const IdCardView = dynamic(() => import("@/components/three/IdCardView"), { ssr: false });

export default function AboutHero() {
  const three = useThreeOn();
  const ref = useRef<HTMLElement>(null);
  return (
    <section ref={ref} className="page grid items-center gap-8 lg:grid-cols-[1.1fr_1fr]" aria-labelledby="about-h">
      <div>
        <p className="kicker">About</p>
        <h1 id="about-h" className="mt-3 font-display text-[clamp(2.8rem,7.2vw,5.4rem)] font-extrabold leading-[0.9]">
          Self-taught,<br />and shipping.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-fg/80">{profile.short}</p>
        <p className="mt-4 text-sm text-muted">{profile.available}</p>
      </div>
      <div className="relative h-[62svh] min-h-[420px]">
        {three ? (
          <IdCardView anchor={ref} />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <div className="glass w-64 rounded-3xl p-4">
              <Image src={profile.photo} alt={profile.name} width={400} height={400} className="rounded-2xl" priority />
              <p className="mt-4 font-display text-2xl font-extrabold">{profile.name}</p>
              <p className="text-sm text-muted">Machine Learning Engineer · Founder, Axiveri</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
