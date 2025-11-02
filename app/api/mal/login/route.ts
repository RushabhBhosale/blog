import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createPkce } from "@/lib/pkce";

export async function GET() {
  const { MAL_CLIENT_ID, MAL_REDIRECT_URI, MAL_STATE } = process.env;
  const { code_verifier, code_challenge } = await createPkce();
  const secure = process.env.NODE_ENV === "production";
  console.info("[MAL/login] Initiating auth redirect", {
    hasClientId: Boolean(MAL_CLIENT_ID),
    hasRedirectUri: Boolean(MAL_REDIRECT_URI),
    state: MAL_STATE ?? "state",
    secure,
  });

  const jar = await cookies();
  jar.set("mal_code_verifier", code_verifier, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  jar.set("mal_oauth_state", MAL_STATE ?? "state", {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  console.info("[MAL/login] Stored PKCE verifier and state cookie", {
    verifierSample: code_verifier.slice(0, 8),
  });

  const u = new URL("https://myanimelist.net/v1/oauth2/authorize");
  u.searchParams.set("response_type", "code");
  u.searchParams.set("client_id", MAL_CLIENT_ID!);
  u.searchParams.set("redirect_uri", MAL_REDIRECT_URI!);
  u.searchParams.set("code_challenge", code_challenge);
  u.searchParams.set("code_challenge_method", "S256");
  u.searchParams.set("state", MAL_STATE ?? "state");

  console.info("[MAL/login] Redirecting to MAL authorize endpoint", {
    redirect: u.toString(),
  });

  return NextResponse.redirect(u.toString(), { status: 302 });
}
