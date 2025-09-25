import { NextRequest, NextResponse } from "next/server";
import "@/lib/db"; // initialize DB once per server instance
import Comment from "@/models/comment";
import jwt from "jsonwebtoken";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const comments = await Comment.find({ slug }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ comments });
}

export async function POST(
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
    const body = await req.json();
    const text = String(body?.comment || "").trim();
    const username = String(body?.username || decoded.name || decoded.email);
    if (!text)
      return NextResponse.json({ error: "Empty comment" }, { status: 400 });

    const created = await Comment.create({
      slug,
      comment: text,
      user: decoded.userId,
      username,
      isOffensive: false,
    });
    return NextResponse.json({ comment: created }, { status: 201 });
  } catch (err) {
    console.error("Comment create error", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

