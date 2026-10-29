import type { Metadata } from "next";
import { siteMarkdown } from "@/lib/plaintext";
import { renderMarkdown } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Text-only version",
  description: "The whole portfolio as plain text. Fast on any connection, readable by screen readers and AI agents.",
  alternates: { canonical: "/light" },
};
export const revalidate = 300;

export default async function Light() {
  const md = await siteMarkdown(false);
  return (
    <div className="page max-w-3xl pb-10 pt-28">
      <p className="text-sm text-muted">Text-only version. No 3D, no animation. <a className="underline" href="/llms-full.txt">Full text with blog posts</a>.</p>
      <div className="prose-blog mt-6" dangerouslySetInnerHTML={{ __html: renderMarkdown(md.replace(/^# .*\n/, "").replace(/^> /m, "")) }} />
    </div>
  );
}
