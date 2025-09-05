import { NextRequest, NextResponse } from "next/server";
import Blog from "@/models/blog";
import { connectDB } from "@/lib/db";

connectDB();

function tokenize(input?: string | null) {
  if (!input) return [] as string[];
  return input
    .toLowerCase()
    .split(/[^a-z0-9]+/gi)
    .filter((t) => t && t.length >= 3);
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category") || undefined;
    const excludeSlug = url.searchParams.get("excludeSlug") || undefined;
    const tagsParam = url.searchParams.get("tags") || "";
    const titleParam = url.searchParams.get("title") || "";
    const limit = Math.max(1, Math.min(10, Number(url.searchParams.get("limit") || 5)));

    const tags = tagsParam
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const tokens = tokenize(titleParam);

    const match: any = {};
    if (excludeSlug) match.slug = { $ne: excludeSlug.toLowerCase().trim() };
    if (category) match.category = category;

    // Build dynamic scoring based on tags and tokens
    const tokenScoreConds = tokens.map((tok) => ({
      $cond: [
        {
          $or: [
            { $regexMatch: { input: "$title", regex: tok, options: "i" } },
            { $regexMatch: { input: "$metaTitle", regex: tok, options: "i" } },
            { $regexMatch: { input: "$metaDescription", regex: tok, options: "i" } },
            { $regexMatch: { input: "$content", regex: tok, options: "i" } },
          ],
        },
        1,
        0,
      ],
    }));

    const pipeline: any[] = [
      { $match: match },
      {
        $addFields: {
          tagMatches: tags.length
            ? { $size: { $setIntersection: ["$tags", tags] } }
            : 0,
          tokenHits: tokenScoreConds.length ? { $sum: tokenScoreConds } : 0,
          catBonus: category ? 1 : 0,
        },
      },
      {
        $addFields: {
          score: {
            $add: [
              { $multiply: ["$tagMatches", 3] },
              "$tokenHits",
              "$catBonus",
            ],
          },
        },
      },
      { $sort: { score: -1, createdAt: -1 } },
      { $limit: limit },
      { $project: { content: 0 } },
    ];

    const related = await Blog.aggregate(pipeline);
    return NextResponse.json(related);
  } catch (err) {
    console.error("Error fetching related blogs:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
