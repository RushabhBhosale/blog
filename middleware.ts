// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_MATCH = [
  /^\/admin(\/|$)/,
  /^\/blog\/add$/,
  /^\/blog\/[^/]+\/edit$/,
];

// lightweight UA check (optional but nice-to-have)
function isBot(ua: string | null) {
  if (!ua) return false;
  return /(googlebot|bingbot|duckduckbot|baiduspider|yandex|petalbot|semrush|ahrefs|mj12bot)/i.test(
    ua
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;
  const hit = ADMIN_MATCH.some((re) => re.test(pathname));

  if (!hit) return NextResponse.next();

  // Always attach a noindex header for admin/protected URLs
  const attachNoIndex = (res: NextResponse) => {
    res.headers.set("x-robots-tag", "noindex, nofollow");
    // avoid these being cached anywhere
    res.headers.set("cache-control", "no-store");
    return res;
  };

  // Let bots through to see the page <meta robots noindex> from /app/admin/layout.tsx
  // (prevents indexing the redirect target like /home)
  if (isBot(req.headers.get("user-agent"))) {
    return attachNoIndex(NextResponse.next());
  }

  // Humans without a session → redirect, but still send noindex on the redirect response
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/home";
    url.search = "";
    return attachNoIndex(NextResponse.redirect(url));
  }

  // Authenticated → proceed (page layout will also emit <meta name="robots" content="noindex,nofollow">)
  return attachNoIndex(NextResponse.next());
}

export const config = {
  matcher: ["/admin/:path*", "/blog/add", "/blog/:slug/edit"],
};
