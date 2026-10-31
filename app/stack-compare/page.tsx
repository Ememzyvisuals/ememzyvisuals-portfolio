// app/stack-compare/page.tsx
// Temporary page to compare the two tech stack ideas. Remove once one is chosen.
import type { Metadata } from "next";
import { ChessBoard } from "@/components/three/chess/ChessBoard";
import { Abacus } from "@/components/three/abacus/Abacus";

export const metadata: Metadata = { title: "Stack compare", robots: { index: false, follow: false } };

export default function StackCompare() {
  return (
    <div className="container-padded space-y-16 py-12">
      <section>
        <h2 className="section-heading">Option A: Abacus</h2>
        <Abacus />
      </section>
      <section>
        <h2 className="section-heading">Option B: Chess</h2>
        <ChessBoard />
      </section>
    </div>
  );
}
