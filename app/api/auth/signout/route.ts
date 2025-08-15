import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({ message: "Signed out successfully" });

    response.cookies.set({
      name: "token",
      value: "",
      path: "/",
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: "Failed to sign out" }, { status: 500 });
  }
}
