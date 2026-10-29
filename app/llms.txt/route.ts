import { siteMarkdown } from "@/lib/plaintext";
export const revalidate = 300;
export async function GET() {
  return new Response(await siteMarkdown(false), { headers: { "content-type": "text/markdown; charset=utf-8", "cache-control": "public, max-age=300" } });
}
