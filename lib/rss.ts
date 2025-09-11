import { connectDB } from "@/lib/db";
import Blog from "@/models/blog";

const SITE = (process.env.SITE_URL || "https://dailysparks.in").replace(/\/+$/, "");

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function escXml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function generateRssXml() {
  await connectDB();

  const blogs = await Blog.find({ status: { $ne: "Hide" } })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  const items = blogs
    .map((b: any) => {
      const url = `${SITE}/blog/${encodeURIComponent(b.slug)}`;
      const imageUrl = b?.image
        ? b.image.startsWith("http")
          ? b.image
          : `${SITE}${b.image.startsWith("/") ? "" : "/"}${b.image}`
        : undefined;
      const description = stripHtml(b.metaDescription || b.content || "").slice(
        0,
        300
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

