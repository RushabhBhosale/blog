import { NextRequest, NextResponse } from "next/server";
import "@/lib/db"; // initialize DB once per server instance
import Comment from "@/models/comment";
import jwt from "jsonwebtoken";

async function requireUser(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token)
    return {
      ok: false,
      res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    return { ok: true, decoded } as const;
  } catch {
    return {
      ok: false,
      res: NextResponse.json({ error: "Invalid token" }, { status: 401 }),
    };
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ slug: string; commentId: string }> },
) {
  try {
    const auth = await requireUser(req);
    if (!auth.ok) return auth.res!;
    const { commentId } = await context.params;
    const body = await req.json();
    const text = String(body?.comment || "").trim();
    if (!text)
      return NextResponse.json({ error: "Empty comment" }, { status: 400 });
    const existing = await Comment.findById(commentId);
    if (!existing)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    const isOwner = String(existing.user || "") === String(auth.decoded.userId);
    const isAdmin = auth.decoded.role === "admin";
    if (!isOwner && !isAdmin)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    existing.comment = text;
    await existing.save();
    return NextResponse.json({ comment: existing }, { status: 200 });
  } catch (err) {
    console.error("Comment update error", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ slug: string; commentId: string }> },
) {
  try {
    const auth = await requireUser(req);
    if (!auth.ok) return auth.res!;
    const { commentId } = await context.params;
    const existing = await Comment.findById(commentId);
    if (!existing)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    const isOwner = String(existing.user || "") === String(auth.decoded.userId);
    const isAdmin = auth.decoded.role === "admin";
    if (!isOwner && !isAdmin)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    await Comment.findByIdAndDelete(commentId);
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (err) {
    console.error("Comment delete error", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

