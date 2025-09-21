import "@/lib/db"; // initialize DB once per server instance
import Blog from "@/models/blog";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// Toggle like/unlike a blog by slug
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params;
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const blog = await Blog.findOne({ slug });
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const likesArray = Array.isArray(blog.likes) ? blog.likes : [];
    const alreadyLiked = likesArray.some(
      (id: any) => id.toString() === userId.toString(),
    );

    if (alreadyLiked) {
      blog.likes = likesArray.filter(
        (id: any) => id.toString() !== userId.toString(),
      );
    } else {
      blog.likes = [...likesArray, userId];
    }

    await blog.save();

    // Revalidate the blog page path so ISR pages pick up new likes
    try {
      revalidatePath(`/blog/${slug}`);
    } catch {}

    return NextResponse.json(
      { blog, liked: !alreadyLiked, totalLikes: blog.likes.length },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error liking/unliking blog", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
