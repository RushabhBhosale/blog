import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Guard selected routes by requiring a session token cookie.
// We purposely avoid heavy JWT verification in middleware (edge runtime),
// and only check presence of the cookie to block anonymous access.

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // If no token, redirect to /home for protected pages
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/home";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Allow through
  return NextResponse.next();
}

export const config = {
  // Only run on protected routes (pages, not APIs)
  matcher: [
    "/admin/:path*",
    "/blog/add",
    "/blog/:slug/edit",
  ],
};

