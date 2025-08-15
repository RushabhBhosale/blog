import { connectDB } from "@/lib/db";
import blog from "@/models/blog";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const blogs = await blog.find().sort({ createdAt: -1 }).limit(5);
    if (!blogs || blogs.length === 0) {
      return NextResponse.json({ error: "No Blogs found" }, { status: 404 });
    }

    return NextResponse.json({ blogs }, { status: 200 });
  } catch (error) {
    console.error("Error finding the blogs", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
