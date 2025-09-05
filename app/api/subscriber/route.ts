import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Subscriber from "@/models/subscriber";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
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

    const subscribers = await Subscriber.find({}, "email createdAt").sort({ createdAt: -1 });
    return NextResponse.json({ subscribers }, { status: 200 });
  } catch (error) {
    console.error("Error fetching subscribers", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

