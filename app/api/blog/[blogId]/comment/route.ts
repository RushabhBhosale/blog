import { connectDB } from "@/lib/db";
import Comment from "@/models/comment";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ blogId: string }> }
) {
  try {
    await connectDB();
    const { blogId } = await context.params;
    console.log("blgp", blogId);

    const comments = await Comment.find({ blogId })
      .sort({ createdAt: -1 })
      .populate("user", "name email imageUrl");

    if (!comments || comments.length === 0) {
      return NextResponse.json(
        { error: "No comments found for this blog" },
        { status: 200 }
      );
    }

    return NextResponse.json({ comments }, { status: 200 });
  } catch (error) {
    console.error("Error finding comments", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ blogId: string }> }
) {
  await connectDB();
  const { blogId } = await context.params;
  const body = await req.json();

  try {
    const newComment = await Comment.create({
      blogId,
      comment: body.comment,
      user: body.userId,
    });
    const populated = await newComment.populate("user", "name email imageUrl");
    return NextResponse.json({ comment: [populated] }, { status: 201 });
  } catch (error) {
    console.error("Error posting comment", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
