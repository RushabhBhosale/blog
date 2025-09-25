import { NextRequest, NextResponse } from "next/server";
import "@/lib/db"; // initialize DB once per server instance
import Blog from "@/models/blog";

export async function POST(
  _req: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params;
    const updated = await Blog.findOneAndUpdate(
      { slug },
      { $inc: { viewCount: 1 } },
      { new: true },
    ).select("viewCount slug");
    if (!updated)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ views: updated.viewCount });
  } catch (err) {
    console.error("views inc error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

