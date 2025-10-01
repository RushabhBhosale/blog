import { NextRequest, NextResponse } from "next/server";
import "@/lib/db"; // initialize DB once per server instance
import MiniSpark from "@/models/minispark";
import jwt from "jsonwebtoken";
import slugify from "slugify";

const SLUG = { lower: true, strict: true, trim: true } as const;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const kind = searchParams.get("kind") || undefined;
  const limit = Math.max(1, Math.min(24, Number(searchParams.get("limit") || 12)));
  const query: any = {};
  if (kind) query.kind = kind;
  const items = await MiniSpark.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    const title: string = (body?.title || "").toString().trim();
    const content: string = (body?.content || "").toString();
    const kind: string = (body?.kind || "other").toString();
    const format: string | undefined = (body?.format || "").toString().trim() || undefined; // movie | tvseries
    const language: string | undefined = (body?.language || "").toString().trim() || undefined;
    const rating = body?.rating ? Number(body.rating) : undefined;
    const location = (body?.location || "").toString().trim() || undefined;
    const tags: string[] = Array.isArray(body?.tags) ? body.tags : [];
    const incomingSlug: string = (body?.slug || "").toString().trim();
    const image: string | undefined = (body?.image || "").toString().trim() || undefined;
    const imageAlt: string | undefined = (body?.imageAlt || "").toString();

    // Restrict authoring to a specific admin email
    const allowedEmail = "rushabhbhosale25757@gmail.com";
    if ((decoded?.email || "").toLowerCase() !== allowedEmail.toLowerCase()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (!title || !content) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    if (kind === "movie" && format && !["movie", "tvseries"].includes(format)) {
      return NextResponse.json({ error: "Invalid format" }, { status: 400 });
    }
    const slug = slugify(incomingSlug || title, SLUG);

    if (typeof rating === "number" && (rating < 1 || rating > 10)) {
      return NextResponse.json({ error: "Rating must be 1-10" }, { status: 400 });
    }

    const created = await MiniSpark.create({
      title,
      slug,
      content,
      kind,
      format: kind === "movie" ? format : undefined,
      language: kind === "movie" ? language : undefined,
      rating,
      location,
      tags,
      author: decoded.name || decoded.email,
      authorId: decoded.userId,
      image,
      imageAlt,
    });
    return NextResponse.json({ item: created }, { status: 201 });
  } catch (err) {
    console.error("MiniSpark create error", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
