import { NextRequest, NextResponse } from "next/server";
import "@/lib/db"; // initialize DB once per server instance
import Blog from "@/models/blog";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const { slug } = await context.params;
    const userId = new mongoose.Types.ObjectId(decoded.userId);
    const blog = await Blog.findOne({ slug });
    if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const already = (blog.likes as any[]).some((id: any) => String(id) === String(userId));
    if (already) {
      blog.likes = (blog.likes as any[]).filter((id: any) => String(id) !== String(userId)) as any;
    } else {
      (blog.likes as any[]).push(userId as any);
    }
    await blog.save();
    return NextResponse.json({ liked: !already, totalLikes: (blog.likes as any[]).length, blog });
  } catch (err) {
    console.error("like toggle error", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

