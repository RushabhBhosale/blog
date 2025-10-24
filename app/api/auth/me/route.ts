import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import "@/lib/db"; // initialize DB once per server instance
import User from "@/models/user";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ user: null }, { status: 200 });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user: any = await User.findById(decoded.userId).lean();
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const serialized = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
      username: user.username,
      headline: user.headline,
      bio: user.bio,
      location: user.location,
      website: user.website,
      socials: user.socials || {},
      imageUrl: user.imageUrl,
      canAutoPublish: user.canAutoPublish,
      isActive: user.isActive,
    };

    return NextResponse.json({ user: serialized });
  } catch (err) {
    console.error("auth/me error", err);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
