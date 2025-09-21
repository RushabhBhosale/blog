import { NextRequest, NextResponse } from "next/server";
import { unsubscribeByToken } from "@/lib/newsletter";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await context.params;
    if (!token) return NextResponse.redirect(new URL("/", _req.url));

    const ok = await unsubscribeByToken(token);
    // Redirect to a simple confirmation page (home with query)
    const url = new URL("/home", _req.url);
    url.searchParams.set("unsubscribed", ok ? "1" : "0");
    return NextResponse.redirect(url);
  } catch (err) {
    console.error("Unsubscribe error", err);
    const url = new URL("/home", _req.url);
    url.searchParams.set("unsubscribed", "0");
    return NextResponse.redirect(url);
  }
}
