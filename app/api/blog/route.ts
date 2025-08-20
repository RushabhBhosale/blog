import { connectDB } from "@/lib/db";
import Blog from "@/models/blog";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const blogs = await Blog.find().sort({ createdAt: -1 });
  return NextResponse.json({ blogs }, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { title, content, category, tags, image, author, authorId } =
      await req.json();

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: "Title, content, and category are required" },
        { status: 400 }
      );
    }

    const newBlog = await Blog.create({
      title,
      content,
      category,
      tags,
      image,
      author,
      authorId,
    });

    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    console.error("Error posting the blog", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
