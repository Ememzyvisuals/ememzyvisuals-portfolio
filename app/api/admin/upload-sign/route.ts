// app/api/admin/upload-sign/route.ts
// Signs a direct browser-to-Cloudinary upload, so only the signed-in admin can upload and large videos
// never pass through Vercel. Needs CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.
import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { cfg } from "@/lib/config";

export async function POST(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [cloud, key, secret] = await Promise.all([cfg("CLOUDINARY_CLOUD_NAME"), cfg("CLOUDINARY_API_KEY"), cfg("CLOUDINARY_API_SECRET")]);
  if (!cloud || !key || !secret) return NextResponse.json({ error: "Cloudinary is not set up. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET." }, { status: 503 });
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "portfolio/gallery";
  // parameters must be sorted alphabetically and joined, then the secret appended
  const toSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = createHash("sha1").update(toSign + secret).digest("hex");
  return NextResponse.json({ cloud, key, timestamp, folder, signature });
}
