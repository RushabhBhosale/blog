import { connectDB } from "@/lib/db";
import Blog from "@/models/blog";
import { getServerSideSitemap } from "next-sitemap";
import type { ISitemapField } from "next-sitemap";

export async function GET() {
  await connectDB();

  const blogs = await Blog.find().select("slug updatedAt");
  console.log("Fetched blogs:", blogs.length);

  const fields: ISitemapField[] = blogs.map((blog: any) => ({
    loc: `https://dailysparks.rushabh.in/blog/${blog.slug}`,
    lastmod: blog.updatedAt?.toISOString(),
    changefreq: "daily" as const,
    priority: 0.8,
  }));

  return getServerSideSitemap(fields);
}
