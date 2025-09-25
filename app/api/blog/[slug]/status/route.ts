import { NextRequest, NextResponse } from "next/server";
import "@/lib/db"; // initialize DB once per server instance
import Blog from "@/models/blog";
import jwt from "jsonwebtoken";

export async function PATCH(
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
    if (decoded.role !== "admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { slug } = await context.params;
    const body = await req.json();
    const allowed = new Set(["Draft", "Published", "Pending", "Hide"]);
    const status = String(body?.status || "");
    if (!allowed.has(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updated = await Blog.findOneAndUpdate(
      { slug },
      { $set: { status } },
      { new: true },
    );
    if (!updated)
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    return NextResponse.json({ blog: updated });
  } catch (err) {
    console.error("Error updating blog status", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

