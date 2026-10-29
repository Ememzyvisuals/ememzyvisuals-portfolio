"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useThreeOn } from "@/lib/theme";

const MamaTitiView = dynamic(() => import("@/components/three/MamaTitiView"), { ssr: false });

export default function GamesHero() {
  const three = useThreeOn();
  return (
    <div className="relative h-[52svh] min-h-[340px]">
      {three ? (
        <>
          <MamaTitiView />
          <p className="absolute bottom-2 right-2 text-xs text-muted">Mama Titi, from Bùkà Hustle</p>
        </>
      ) : (
        <Image src="/images/games/buka-hustle.webp" alt="Bùkà Hustle key art with Mama Titi" fill sizes="50vw" className="rounded-xl3 object-cover" />
      )}
    </div>
  );
}
