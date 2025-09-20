import "@/lib/db"; // initialize DB once per server instance
import category from "@/models/category";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const categories = await category.find().sort({ createdAt: -1 });

    return NextResponse.json({ category: categories }, { status: 200 });
  } catch (error) {
    console.error("Error finding all categories", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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
    const { title } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const createdCategory = await category.create({
      title,
    });

    return NextResponse.json({ category: createdCategory }, { status: 201 });
  } catch (error) {
    console.error("Error posting the category", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
