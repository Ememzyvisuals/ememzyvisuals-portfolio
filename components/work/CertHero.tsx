"use client";
import dynamic from "next/dynamic";
import { useThreeOn } from "@/lib/theme";

const CertRingView = dynamic(() => import("@/components/three/CertRingView"), { ssr: false });

export default function CertHero() {
  const three = useThreeOn();
  if (!three) return null;
  return <div className="relative h-[46svh] min-h-[300px]"><CertRingView /></div>;
}
