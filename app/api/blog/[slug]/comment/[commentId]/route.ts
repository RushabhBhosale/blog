import "@/lib/db"; // initialize DB once per server instance
import Comment from "@/models/comment";
import { NextRequest, NextResponse } from "next/server";

// GET single comment
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string; commentId: string }> },
) {
  try {
    const { commentId } = await context.params;

    const comment = await Comment.findById(commentId).populate(
      "user",
      "name email imageUrl",
    );
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json({ comment }, { status: 200 });
  } catch (error) {
    console.error("Error fetching comment", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

// UPDATE comment
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ slug: string; commentId: string }> },
) {
  try {
    const { commentId } = await context.params;
    const { comment } = await req.json();

    if (!comment) {
      return NextResponse.json(
        { error: "Comment text is required" },
        { status: 400 },
      );
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { comment },
      { new: true },
    ).populate("user", "name email imageUrl");

    if (!updatedComment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json({ comment: updatedComment }, { status: 200 });
  } catch (error) {
    console.error("Error updating comment", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

// DELETE comment
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ slug: string; commentId: string }> },
) {
  try {
    const { commentId } = await context.params;

    const deletedComment = await Comment.findByIdAndDelete(commentId);
    if (!deletedComment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Comment deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting comment", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
