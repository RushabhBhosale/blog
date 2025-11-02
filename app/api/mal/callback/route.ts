import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { MAL_CLIENT_ID, MAL_CLIENT_SECRET, MAL_REDIRECT_URI, MAL_STATE } =
    process.env;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const jar = await cookies();
  const code_verifier = jar.get("mal_code_verifier")?.value;
  const secure = process.env.NODE_ENV === "production";
  console.info("[MAL/callback] Received callback", {
    queryCodePresent: Boolean(code),
    state,
    hasVerifierCookie: Boolean(code_verifier),
    secure,
  });

  if (!code || !code_verifier) {
    console.warn("[MAL/callback] Missing code or verifier", {
      queryCodePresent: Boolean(code),
      hasVerifierCookie: Boolean(code_verifier),
    });
    return NextResponse.json(
      { error: "Missing code or verifier" },
      { status: 400 }
    );
  }
  if ((MAL_STATE ?? "state") !== (state ?? "")) {
    console.warn("[MAL/callback] State mismatch", {
      expected: MAL_STATE ?? "state",
      received: state,
    });
    return NextResponse.json({ error: "Invalid state" }, { status: 400 });
  }

  const body = new URLSearchParams();
  body.set("grant_type", "authorization_code");
  body.set("client_id", MAL_CLIENT_ID ?? "");
  if (MAL_CLIENT_SECRET) body.set("client_secret", MAL_CLIENT_SECRET);
  body.set("code", code);
  body.set("redirect_uri", MAL_REDIRECT_URI ?? "");
  body.set("code_verifier", code_verifier);
  console.info("[MAL/callback] Exchanging code", {
    verifierSample: code_verifier.slice(0, 8),
    redirectUri: MAL_REDIRECT_URI,
  });

  const res = await fetch("https://myanimelist.net/v1/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("[MAL/callback] Token exchange failed", {
      status: res.status,
      statusText: res.statusText,
    });
    const t = await res.text();
    return NextResponse.json(
      { error: "Token exchange failed", details: t },
      { status: 400 }
    );
  }

  const json = await res.json();
  console.info("[MAL/callback] Token exchange success", {
    hasAccessToken: Boolean(json.access_token),
    hasRefreshToken: Boolean(json.refresh_token),
    expiresIn: json.expires_in,
  });
  const resp = NextResponse.redirect(new URL("/mal/success", request.url));
  jar.set("mal_access_token", json.access_token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: json.expires_in ?? 3600,
  });
  if (json.refresh_token)
    jar.set("mal_refresh_token", json.refresh_token, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  jar.delete("mal_code_verifier");
  jar.delete("mal_oauth_state");
  return resp;
}
