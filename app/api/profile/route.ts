import { NextRequest, NextResponse } from "next/server";
import "@/lib/db"; // initialize DB once per server instance
import User from "@/models/user";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

type AuthResult =
  | { ok: true; userId: string }
  | { ok: false; res: NextResponse };

function requireAuth(req: NextRequest): AuthResult {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return {
      ok: false,
      res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    return { ok: true, userId: decoded.userId };
  } catch {
    return {
      ok: false,
      res: NextResponse.json({ error: "Invalid token" }, { status: 401 }),
    };
  }
}

function sanitizeUrl(value: string | undefined) {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed.length) return undefined;
  try {
    const url = new URL(
      trimmed.startsWith("http") ? trimmed : `https://${trimmed}`
    );
    return url.toString();
  } catch {
    return undefined;
  }
}

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth.ok) return auth.res;

  const user: any = await User.findById(auth.userId).lean();
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const profile = {
    userId: user._id.toString(),
    email: user.email,
    name: user.name || "",
    username: user.username || "",
    headline: user.headline || "",
    bio: user.bio || "",
    location: user.location || "",
    website: user.website || "",
    imageUrl: user.imageUrl || "",
    socials: user.socials || {},
  };

  return NextResponse.json({ profile }, { status: 200 });
}

export async function PUT(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth.ok) return auth.res;

  const {
    name,
    username,
    headline,
    bio,
    location,
    website,
    socials,
    imageUrl,
  } = await req.json();

  const update: any = {};

  if (typeof name === "string") {
    const trimmed = name.trim();
    if (trimmed.length > 80) {
      return NextResponse.json(
        { error: "Name must be 80 characters or fewer" },
        { status: 400 }
      );
    }
    update.name = trimmed;
  }

  if (typeof username === "string") {
    const trimmed = username.trim().toLowerCase();
    if (!/^[a-z0-9._-]{3,30}$/.test(trimmed)) {
      return NextResponse.json(
        {
          error:
            "Username must be 3-30 characters and contain only letters, numbers, dots, underscores, or hyphens",
        },
        { status: 400 }
      );
    }
    const existing = await User.findOne({
      username: trimmed,
      _id: { $ne: auth.userId },
    }).lean();
    if (existing) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 409 }
      );
    }
    update.username = trimmed;
  }

  if (typeof headline === "string") {
    const trimmed = headline.trim();
    if (trimmed.length > 140) {
      return NextResponse.json(
        { error: "Headline must be 140 characters or fewer" },
        { status: 400 }
      );
    }
    update.headline = trimmed;
  }

  if (typeof bio === "string") {
    const trimmed = bio.trim();
    if (trimmed.length > 600) {
      return NextResponse.json(
        { error: "Bio must be 600 characters or fewer" },
        { status: 400 }
      );
    }
    update.bio = trimmed;
  }

  if (typeof location === "string") {
    const trimmed = location.trim();
    if (trimmed.length > 80) {
      return NextResponse.json(
        { error: "Location must be 80 characters or fewer" },
        { status: 400 }
      );
    }
    update.location = trimmed;
  }

  if (typeof website === "string") {
    const normalized = sanitizeUrl(website);
    if (!normalized && website.trim().length) {
      return NextResponse.json(
        { error: "Website URL is invalid" },
        { status: 400 }
      );
    }
    update.website = normalized || "";
  }

  if (typeof imageUrl === "string") {
    update.imageUrl = imageUrl.trim();
  }

  if (socials && typeof socials === "object") {
    const allowedKeys = [
      "twitter",
      "linkedin",
      "github",
      "instagram",
      "youtube",
    ] as const;
    const sanitized: Record<string, string> = {};
    for (const key of allowedKeys) {
      const value = (socials as any)[key];
      if (typeof value === "string" && value.trim().length) {
        sanitized[key] = value.trim();
      }
    }
    update.socials = sanitized;
  }

  if (!Object.keys(update).length) {
    return NextResponse.json(
      { error: "No valid fields to update" },
      { status: 400 }
    );
  }

  const user: any = await User.findByIdAndUpdate(auth.userId, update, {
    new: true,
    runValidators: true,
  }).lean();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const profile = {
    userId: user._id.toString(),
    email: user.email,
    name: user.name || "",
    username: user.username || "",
    headline: user.headline || "",
    bio: user.bio || "",
    location: user.location || "",
    website: user.website || "",
    imageUrl: user.imageUrl || "",
    socials: user.socials || {},
  };

  return NextResponse.json({ profile }, { status: 200 });
}
