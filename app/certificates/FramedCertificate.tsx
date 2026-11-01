"use client";
// A certificate in a real-looking frame (moulding, white mount, glass sheen, cast shadow)
// that tilts in 3D toward the pointer or finger. Pure CSS, so it costs nothing on phones.
import { useRef } from "react";

export function FramedCertificate({ image, alt }: { image: string; alt: string }) {
  const el = useRef<HTMLDivElement>(null);
  const move = (x: number, y: number) => {
    const r = el.current!.getBoundingClientRect();
    const px = (x - r.left) / r.width - 0.5, py = (y - r.top) / r.height - 0.5;
    el.current!.style.transform = `rotateY(${px * 14}deg) rotateX(${-py * 14}deg) translateZ(0)`;
    el.current!.style.setProperty("--gx", `${(px + 0.5) * 100}%`);
    el.current!.style.setProperty("--gy", `${(py + 0.5) * 100}%`);
  };
  const reset = () => { if (el.current) el.current.style.transform = "rotateY(-6deg) rotateX(3deg)"; };
  return (
    <div className="[perspective:1100px]">
      <div
        ref={el}
        onPointerMove={(e) => move(e.clientX, e.clientY)}
        onPointerLeave={reset}
        className="relative rounded-[6px] p-[14px] transition-transform duration-300 ease-out will-change-transform"
        style={{
          transform: "rotateY(-6deg) rotateX(3deg)",
          transformStyle: "preserve-3d",
          background: "linear-gradient(145deg,#3a3a3a,#0d0d0d 55%,#1e1e1e)",
          boxShadow: "0 30px 50px -22px rgba(0,0,0,.55), 0 10px 18px -10px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.18)",
        }}
      >
        <div className="rounded-[2px] bg-[#f4f1ea] p-[6%] shadow-[inset_0_2px_6px_rgba(0,0,0,.25)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={alt} loading="lazy" decoding="async" className="block w-full shadow-[0_1px_3px_rgba(0,0,0,.25)]" />
        </div>
        {/* glass sheen that follows the pointer */}
        <div className="pointer-events-none absolute inset-[14px] rounded-[2px]"
          style={{ background: "radial-gradient(circle at var(--gx,30%) var(--gy,20%), rgba(255,255,255,.35), rgba(255,255,255,0) 45%)", mixBlendMode: "soft-light" }} />
      </div>
    </div>
  );
}
