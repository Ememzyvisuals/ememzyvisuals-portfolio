import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { isAdmin, sameOrigin } from "@/lib/auth";

// Cloudinary signed upload. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET once in your
// environment. The secret never leaves the server; the browser uploads straight to Cloudinary with this signature.
export async function POST(req: Request) {
  if (!sameOrigin(req) || !isAdmin()) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const { CLOUDINARY_CLOUD_NAME: cloud, CLOUDINARY_API_KEY: key, CLOUDINARY_API_SECRET: secret } = process.env;
  if (!cloud || !key || !secret) return NextResponse.json({ error: "Cloudinary is not set up. Add the three CLOUDINARY_ values to your environment." }, { status: 503 });
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "portfolio/blog";
  const toSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto.createHash("sha1").update(toSign + secret).digest("hex");
  return NextResponse.json({ cloud, key, timestamp, folder, signature });
}
