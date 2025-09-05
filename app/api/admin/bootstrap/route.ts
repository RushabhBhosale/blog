import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, token } = await req.json();
    if (!email || !token) {
      return NextResponse.json({ error: "email and token required" }, { status: 400 });
    }

    const secret = process.env.ADMIN_BOOTSTRAP_TOKEN;
    if (!secret || token !== secret) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { role: "admin", isActive: true },
      { new: true }
    );
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ message: "Promoted to admin", user: { id: user._id, email: user.email, role: user.role } });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

