"use client";
// components/sections/ProjectsShowcase.tsx
// The Jagora laptop and phone, showing the real projects. Drag to turn them, tap the laptop and it closes,
// turns round and opens again; tap the phone and it shows its back and cameras, then turns back.

import Image from "next/image";
import Link from "next/link";
import { Devices3D } from "@/components/three/devices/Devices3D";

const ON_SCREEN = [
  { name: "ClaudGPT", href: "https://claudgpt.vercel.app" },
  { name: "AethLife", href: "https://aethlife.vercel.app" },
  { name: "FlonexTV", href: "https://flonextv.vercel.app" },
  { name: "NaijaPrep", href: "https://naijaprep.netlify.app" },
  { name: "StudentHub NG", href: "https://studenthub-ng.vercel.app" },
  { name: "NairaNest", href: "https://nairanest.netlify.app" },
  { name: "StoreJet", href: "https://storejet-ng.netlify.app" },
  { name: "A.R Toluwani Store", href: "https://ar-toluwani-store.netlify.app" },
];

export function ProjectsShowcase() {
  return (
    <section id="showcase" className="section-padding container-padded overflow-hidden">
      <div className="grid gap-10 min-w-0 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] lg:items-center">
        <div>
          <h2 className="section-heading">Built and shipped.</h2>
          <p className="text-muted-foreground mt-3 max-w-md break-words">
            Live products on real screens. Tap the laptop or the phone, or drag to turn them.
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 max-w-md">
            {ON_SCREEN.map((p) => (
              <li key={p.name}>
                <Link
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-foreground/80 hover:text-foreground underline-offset-4 hover:underline"
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <Devices3D
          scene="hero"
          className="relative w-full min-w-0 aspect-square sm:aspect-[5/3.4] min-h-[280px]"
          fallback={
            <Image
              src="/shots/claudgpt.webp"
              alt="ClaudGPT on a laptop screen"
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-contain"
            />
          }
        />
      </div>
    </section>
  );
}
