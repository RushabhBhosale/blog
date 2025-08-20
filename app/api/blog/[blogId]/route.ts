import { connectDB } from "@/lib/db";
import blog from "@/models/blog";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ blogId: string }> }
) {
  try {
    const { blogId } = await context.params;

    await connectDB();

    const foundBlog = await blog.findById(blogId);

    if (!foundBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ blog: foundBlog }, { status: 200 });
  } catch (error) {
    console.error("Error finding the blog", error);
    return NextResponse.json(
      { error: "Error finding the blog" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ blogId: string }> }
) {
  try {
    await connectDB();
    const { blogId } = await context.params;
    const { title, content, tags, image, author, category } = await req.json();

    if (!title || !content || !image! || !author || !category) {
      return NextResponse.json(
        {
          error: "Please provide all the required fields",
        },
        { status: 400 }
      );
    }

    const updatedBlog = await blog.findByIdAndUpdate(
      blogId,
      {
        title,
        content,
        tags,
        image,
        author,
        category,
      },
      { new: true }
    );

    if (!updatedBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ blog: updatedBlog }, { status: 200 });
  } catch (error) {
    console.error("Error updating the blog", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ blogId: string }> }
) {
  try {
    const { blogId } = await context.params;
    const foundBlog = await blog.findByIdAndDelete(blogId);

    if (!foundBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Blog deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error deleting the blog", error);
    return NextResponse.json(
      { error: "Error deleting the blog" },
      { status: 500 }
    );
  }
}
