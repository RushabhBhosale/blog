import "@/lib/db"; // initialize DB once per server instance
import Comment from "@/models/comment";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    const comments = await Comment.find({ slug }).sort({ createdAt: -1 });

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
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const body = await req.json();
  try {
    const newComment = await Comment.create({
      slug,
      comment: body.comment,
      user: body.userId,
      username: body.username,
    });
    return NextResponse.json({ comment: newComment }, { status: 201 });
  } catch (error) {
    console.error("Error posting comment", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
