import { NextRequest, NextResponse } from "next/server";
import "@/lib/db"; // initialize DB once per server instance
import Comment from "@/models/comment";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
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
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();
    const slug = searchParams.get("slug")?.trim();

    const query: any = {};
    if (slug) query.slug = slug;
    if (q) query.comment = { $regex: q, $options: "i" };

    const comments = await Comment.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ comments }, { status: 200 });
  } catch (error) {
    console.error("Error fetching comments", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
