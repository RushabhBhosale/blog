import { NextRequest, NextResponse } from "next/server";
import "@/lib/db"; // initialize DB once per server instance
import Hub from "@/models/hub";
import jwt from "jsonwebtoken";
import slugify from "slugify";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const q = category ? { categorySlug: category } : {};
  const hubs = await Hub.find(q).lean();
  return NextResponse.json({ hubs });
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {
      jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    const title: string = (body?.title || "").toString().trim();
    const category: string = (body?.category || body?.categorySlug || "").toString().trim();
    const incomingSlug: string = (body?.slug || "").toString().trim();
    if (!title || !category) {
      return NextResponse.json(
        { error: "Title and category are required" },
        { status: 400 },
      );
    }
    const slug = slugify(incomingSlug || title, { lower: true, strict: true, trim: true });
    if (!slug) {
      return NextResponse.json(
        { error: "Unable to generate slug" },
        { status: 400 },
      );
    }

    // Upsert by slug within category context (slug is globally unique per model)
    const created = await Hub.findOneAndUpdate(
      { slug },
      { title, slug, categorySlug: category },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    ).lean();

    return NextResponse.json({ hub: created }, { status: 201 });
  } catch (err) {
    console.error("Error creating hub:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
