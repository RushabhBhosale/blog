import { NextResponse } from "next/server";
import "@/lib/db"; // initialize DB once per server instance
import Blog from "@/models/blog";

export async function GET(
  _: Request,
  { params }: { params: { category: string; hub: string } },
) {
  const { category, hub } = params;
  const posts = await Blog.find({
    category: new RegExp(`^${category.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i"),
    "hub.slug": hub,
    status: { $ne: "Hide" },
  })
    .sort({ createdAt: -1 })
    .select("title slug category hub")
    .lean();
  return NextResponse.json({ posts });
}

