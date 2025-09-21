import "@/lib/db"; // initialize DB once per server instance
import Blog from "@/models/blog";
import { NextRequest, NextResponse } from "next/server";

function capitalizeFirst(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ category: string }> },
) {
  try {
    const { category } = await context.params;

    const cate = capitalizeFirst(category);

    const blogs = await Blog.find({ category: cate }).sort({ createdAt: -1 });

    return NextResponse.json({ blogs }, { status: 200 });
  } catch (err) {
    console.error("Error fetching category blogs:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
