import "@/lib/db"; // initialize DB once per server instance
import Blog from "@/models/blog";

const SITE = (process.env.SITE_URL || "https://dailysparks.in").replace(
  /\/+$/,
  ""
);

function escXml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function generateOpmlXml() {
  // Distinct categories for visible posts only
  const categories: string[] = await Blog.distinct("category", {
    status: { $ne: "Hide" },
  });

  // Sort categories alphabetically for stable output
  categories.sort((a, b) => a.localeCompare(b));

  const now = new Date();
  const prettyDate = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const rfc822 = now.toUTCString();

  const outlines = [
    // All posts feed group
    `    <outline title="All Posts" text="All Posts">
      <outline type="rss" title="Daily Sparks — All Posts" text="Daily Sparks — All Posts" xmlUrl="${SITE}/rss.xml" htmlUrl="${SITE}/blog" description="All published posts from Daily Sparks."/>
    </outline>`,
    // Category feeds
    ...categories.map((cat) => {
      const safeCat = escXml(cat);
      const rssUrl = `${SITE}/rss.xml?category=${encodeURIComponent(cat)}`;
      const htmlUrl = `${SITE}/blog/${encodeURIComponent(cat)}`;
      const desc = `Posts in ${cat} from Daily Sparks.`;
      return `    <outline title="${safeCat}" text="${safeCat}">
      <outline type="rss" title="Daily Sparks — ${safeCat}" text="Daily Sparks — ${safeCat}" xmlUrl="${rssUrl}" htmlUrl="${htmlUrl}" description="${escXml(
        desc
      )}"/>
    </outline>`;
    }),
  ].join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head>
    <title>My Blog Collection - ${escXml(prettyDate)}</title>
    <dateCreated>${escXml(rfc822)}</dateCreated>
    <dateModified>${escXml(rfc822)}</dateModified>
    <ownerName>Daily Sparks</ownerName>
    <ownerId>${SITE}</ownerId>
    <generator>Next.js OPML Generator</generator>
  </head>
  <body>
${outlines}
  </body>
</opml>`;

  return xml;
}
