import "@/lib/db"; // initialize DB once per server instance
import Blog from "@/models/blog";

const SITE = (process.env.SITE_URL || "https://dailysparks.in").replace(
  /\/+$/,
  "",
);

function stripHtml(html: string) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escXml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

type RssOptions = {
  category?: string;
  limit?: number;
};

export async function generateRssXml(opts: RssOptions = {}) {
  const query: any = { status: { $ne: "Hide" } };
  if (opts.category) {
    // Case-insensitive exact match for category (same as category page)
    const regex = new RegExp(
      `^${opts.category.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
      "i",
    );
    query.category = regex;
  }

  const limit = opts.limit ?? 50;

  const blogs = await Blog.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  const items = blogs
    .map((b: any) => {
      const url = b?.hub?.slug && b?.category
        ? `${SITE}/blogs/${encodeURIComponent(b.category)}/${encodeURIComponent(b.hub.slug)}/${encodeURIComponent(b.slug)}`
        : `${SITE}/blog/${encodeURIComponent(b.slug)}`;
      const imageUrl = b?.image
        ? b.image.startsWith("http")
          ? b.image
          : `${SITE}${b.image.startsWith("/") ? "" : "/"}${b.image}`
        : undefined;
      const description = stripHtml(b.metaDescription || b.content || "").slice(
        0,
        300,
      );
      const pubDate = new Date(b.createdAt || Date.now()).toUTCString();

      return `
        <item>
          <title>${escXml(b.title)}</title>
          <link>${url}</link>
          <guid isPermaLink="true">${url}</guid>
          <pubDate>${pubDate}</pubDate>
          ${b.category ? `<category>${escXml(b.category)}</category>` : ""}
          ${b.author ? `<author>${escXml(b.author)}</author>` : ""}
          ${
            imageUrl
              ? `<enclosure url="${escXml(imageUrl)}" type="image/jpeg" />`
              : ""
          }
          <description><![CDATA[${description}]]></description>
        </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Daily Sparks</title>
    <link>${SITE}</link>
    <description>Latest posts from Daily Sparks</description>
    <language>en</language>
    <ttl>60</ttl>
    ${items}
  </channel>
</rss>`;

  return xml;
}
