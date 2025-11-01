import "@/lib/db"; // initialize DB once per server instance
import category from "@/models/category";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ categoryId: string }> },
) {
  try {
    const { categoryId } = await context.params;

    const foundCategory = await category.findById(categoryId);
    if (!foundCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ category: foundCategory }, { status: 200 });
  } catch (error) {
    console.error("Error finding the category", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ categoryId: string }> },
) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      if (decoded.role !== "admin")
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const { categoryId } = await context.params;
    const body = await req.json();
    const payload: Record<string, any> = {};

    if (typeof body?.title === "string") {
      const title = body.title.trim();
      if (title) {
        payload.title = title;
      }
    }

    if (typeof body?.isHidden === "boolean") {
      payload.isHidden = body.isHidden;
    }

    if (!categoryId || Object.keys(payload).length === 0) {
      return NextResponse.json(
        { error: "Please provide fields to update" },
        { status: 400 },
      );
    }

    const foundCategory = await category.findByIdAndUpdate(
      categoryId,
      payload,
      { new: true },
    );
    if (!foundCategory) {
      return NextResponse.json({ error: "Category not found" });
    }

    return NextResponse.json({ category: foundCategory }, { status: 200 });
  } catch (error) {
    console.error("Error updating the category", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ categoryId: string }> },
) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      if (decoded.role !== "admin")
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const { categoryId } = await context.params;

    const foundCategory = await category.findByIdAndDelete(categoryId);
    if (!foundCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ category: foundCategory }, { status: 200 });
  } catch (error) {
    console.error("Error deleting the category", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
