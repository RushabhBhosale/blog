import { NextRequest, NextResponse } from "next/server";
import Blog from "@/models/blog";
import { connectDB } from "@/lib/db";

connectDB();

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category");
    const excludeId = url.searchParams.get("excludeId");

    if (!category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    const relatedBlogs = await Blog.find({
      category,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    })
      .limit(5)
      .lean();

    return NextResponse.json(relatedBlogs);
  } catch (err) {
    console.error("Error fetching related blogs:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
