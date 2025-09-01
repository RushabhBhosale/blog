import { NextRequest, NextResponse } from "next/server";
import { subscribeEmail } from "@/lib/newsletter";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    const valid = /.+@.+\..+/.test(email);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    await subscribeEmail(email);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Subscribe error", err);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}

