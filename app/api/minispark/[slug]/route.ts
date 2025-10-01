import { NextRequest, NextResponse } from "next/server";
import "@/lib/db"; // initialize DB once per server instance
import MiniSpark from "@/models/minispark";
import jwt from "jsonwebtoken";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const item = await MiniSpark.findOne({ slug }).lean();
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ item });
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { slug } = await context.params;
    const allowedEmail = "rushabhbhosale25757@gmail.com";
    if ((decoded?.email || "").toLowerCase() !== allowedEmail.toLowerCase()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const body = await req.json();
    const update: any = {};
    ["title", "content", "kind", "location", "image", "imageAlt", "language", "verdict"].forEach((k) => {
      if (typeof body?.[k] === "string") update[k] = body[k];
    });
    if (typeof body?.format === "string") {
      if (!["movie", "tvseries"].includes(body.format)) {
        return NextResponse.json({ error: "Invalid format" }, { status: 400 });
      }
      update.format = body.format;
    }
    if (Array.isArray(body?.tags)) update.tags = body.tags;
    if (typeof body?.rating === "number") {
      if (body.rating < 1 || body.rating > 10) {
        return NextResponse.json({ error: "Rating must be 1-10" }, { status: 400 });
      }
      update.rating = body.rating;
    }
    update.author = decoded.name || decoded.email;
    update.authorId = decoded.userId;
    const saved = await MiniSpark.findOneAndUpdate({ slug }, { $set: update }, { new: true });
    if (!saved) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ item: saved });
  } catch (err) {
    console.error("MiniSpark update error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const allowedEmail = "rushabhbhosale25757@gmail.com";
    if ((decoded?.email || "").toLowerCase() !== allowedEmail.toLowerCase())
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const { slug } = await context.params;
    const deleted = await MiniSpark.findOneAndDelete({ slug });
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
