import { NextResponse, type NextRequest } from "next/server";

// Agents that ask for Markdown get the text version of the site instead of the 3D page.
export function middleware(req: NextRequest) {
  const accept = req.headers.get("accept") || "";
  if (req.nextUrl.pathname === "/" && /text\/markdown/.test(accept) && !/text\/html/.test(accept)) {
    return NextResponse.rewrite(new URL("/llms-full.txt", req.url));
  }
  return NextResponse.next();
}
export const config = { matcher: ["/"] };
