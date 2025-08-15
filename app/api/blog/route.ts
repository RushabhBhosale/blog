import { connectDB } from "@/lib/db";
import Blog from "@/models/blog";
import User from "@/models/user";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  await connectDB();
  const blogs = await Blog.find().sort({ createdAt: -1 });
  return NextResponse.json(blogs);
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const dbUser = await User.findOneAndUpdate(
      { clerkId: user.id },
      {
        clerkId: user.id,
        name: user.fullName,
        email: user.primaryEmailAddress?.emailAddress,
        imageUrl: user.imageUrl,
      },
      { upsert: true, new: true }
    );

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" });
    }

    const { title, content, category, tags, image } = await req.json();

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
      author: dbUser._id,
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
