import { NextRequest, NextResponse } from "next/server";
import "@/lib/db"; // initialize DB once per server instance
import Comment from "@/models/comment";
import jwt from "jsonwebtoken";

async function requireAdmin(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token)
    return {
      ok: false,
      res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    if (decoded.role !== "admin") {
      return {
        ok: false,
        res: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      };
    }
    return { ok: true };
  } catch {
    return {
      ok: false,
      res: NextResponse.json({ error: "Invalid token" }, { status: 401 }),
    };
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ commentId: string }> },
) {
  try {
    const admin = await requireAdmin(req);
    if (!admin.ok) return admin.res!;

    const { commentId } = await context.params;
    const body = await req.json();
    const update: any = {};
    if (typeof body.comment === "string") update.comment = body.comment;
    if (typeof body.isOffensive === "boolean")
      update.isOffensive = body.isOffensive;
    if (!Object.keys(update).length) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 },
      );
    }

    const updated = await Comment.findByIdAndUpdate(commentId, update, {
      new: true,
    });
    if (!updated)
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    return NextResponse.json({ comment: updated }, { status: 200 });
  } catch (error) {
    console.error("Error updating comment", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ commentId: string }> },
) {
  try {
    const admin = await requireAdmin(req);
    if (!admin.ok) return admin.res!;

    const { commentId } = await context.params;
    const deleted = await Comment.findByIdAndDelete(commentId);
    if (!deleted)
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting comment", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
