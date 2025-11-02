import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const jar = await cookies();
  const token = jar.get("mal_access_token")?.value;
  if (!token)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? "";
  const limit = searchParams.get("limit") ?? "100";
  const offset = searchParams.get("offset") ?? "0";
  const fields =
    searchParams.get("fields") ??
    "list_status,mean,media_type,alternative_titles,num_episodes,start_season,nsfw";

  const u = new URL("https://api.myanimelist.net/v2/users/@me/animelist");
  if (status) u.searchParams.set("status", status);
  u.searchParams.set("limit", limit);
  u.searchParams.set("offset", offset);
  u.searchParams.set("fields", fields);

  const res = await fetch(u.toString(), {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
