import { NextResponse } from "next/server";
import { generateOpmlXml } from "@/lib/opml";

export const revalidate = 300; // seconds

export async function GET() {
  const xml = await generateOpmlXml();
  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "text/x-opml; charset=utf-8",
      "Cache-Control": "s-maxage=300, stale-while-revalidate=60",
    },
  });
}
