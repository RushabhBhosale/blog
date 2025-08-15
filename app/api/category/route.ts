import { connectDB } from "@/lib/db";
import category from "@/models/category";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
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
    await connectDB();
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
