import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // CDN for devicons tech logos (used in Stack section)
      { protocol: "https", hostname: "cdn.jsdelivr.net" },
      // Ollama logo
      { protocol: "https", hostname: "ollama.com" },
      // Framer (Groq logo)
      { protocol: "https", hostname: "framerusercontent.com" },
      // Any user-uploaded images stored externally
      { protocol: "https", hostname: "*.vercel-storage.com" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 3600,
    // Allow unoptimized local images from public folder
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },

  compress: true,
  poweredByHeader: false,
  // Needed for Prisma on Vercel
  serverComponentsExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
