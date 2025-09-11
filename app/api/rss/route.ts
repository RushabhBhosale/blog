import { NextResponse } from "next/server";
import { generateRssXml } from "@/lib/rss";

export async function GET() {
  const xml = await generateRssXml();
  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=300, stale-while-revalidate=60",
    },
  });
}
