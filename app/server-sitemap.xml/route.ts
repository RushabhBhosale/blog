import { connectDB } from "@/lib/db";
import Blog from "@/models/blog";
import Category from "@/models/category";
import { getServerSideSitemap } from "next-sitemap";
import type { ISitemapField } from "next-sitemap";

export const runtime = "nodejs";

export async function GET() {
  await connectDB();

  const blogs = await Blog.find().select("slug updatedAt");
  const blogFields: ISitemapField[] = blogs.map((blog: any) => ({
    loc: `https://dailysparks.rushabh.in/blog/${blog.slug}`,
    lastmod: blog.updatedAt?.toISOString(),
    changefreq: "daily" as const,
    priority: 0.8,
  }));

  const categories = await Category.find().select("slug updatedAt");
  const categoryFields: ISitemapField[] = categories.map((cat: any) => ({
    loc: `https://dailysparks.rushabh.in/category/${cat.slug}`,
    lastmod: cat.updatedAt?.toISOString(),
    changefreq: "weekly" as const,
    priority: 0.7,
  }));

  const staticFields: ISitemapField[] = [
    {
      loc: "https://dailysparks.rushabh.in/home",
      lastmod: new Date().toISOString(),
      changefreq: "daily" as const,
      priority: 1,
    },
  ];

  const allFields: ISitemapField[] = [
    ...staticFields,
    ...categoryFields,
    ...blogFields,
  ];

  return getServerSideSitemap(allFields);
}
