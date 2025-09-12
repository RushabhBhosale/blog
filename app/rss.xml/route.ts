import { NextResponse } from "next/server";
import { generateRssXml } from "@/lib/rss";

export const revalidate = 300; // seconds

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || undefined;
  const xml = await generateRssXml({ category });
  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=300, stale-while-revalidate=60",
    },
  });
}
