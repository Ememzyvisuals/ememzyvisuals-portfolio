// app/og/route.tsx
// Generates OG images dynamically at /og?title=...&subtitle=...
// Used by project and blog pages for rich unique previews per page

import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "Emmanuel Ariyo";
  const subtitle = searchParams.get("subtitle") || "Creative Software Developer & AI Systems Engineer";
  const tag = searchParams.get("tag") || "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px",
          backgroundColor: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#111111",
              letterSpacing: "-0.5px",
            }}
          >
            Ememzyvisuals
          </div>
          {tag && (
            <div
              style={{
                fontSize: "13px",
                fontWeight: "600",
                color: "#666666",
                backgroundColor: "#f3f3f3",
                padding: "6px 14px",
                borderRadius: "100px",
                border: "1px solid #e5e5e5",
              }}
            >
              {tag}
            </div>
          )}
        </div>

        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              fontSize: title.length > 30 ? "54px" : "72px",
              fontWeight: "800",
              color: "#111111",
              lineHeight: "1.05",
              letterSpacing: "-2px",
              maxWidth: "900px",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: "22px",
              color: "#888888",
              fontWeight: "400",
              maxWidth: "700px",
              lineHeight: "1.5",
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #e5e5e5",
            paddingTop: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Avatar initial */}
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#111111",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: "18px",
                fontWeight: "700",
              }}
            >
              E
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "15px", fontWeight: "600", color: "#111111" }}>
                Emmanuel Ariyo
              </span>
              <span style={{ fontSize: "12px", color: "#888888" }}>
                ememzyvisuals.com
              </span>
            </div>
          </div>

          {/* Available badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              fontWeight: "600",
              color: "#16a34a",
              backgroundColor: "#f0fdf4",
              padding: "8px 16px",
              borderRadius: "100px",
              border: "1px solid #bbf7d0",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#16a34a",
              }}
            />
            Available for new projects
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
