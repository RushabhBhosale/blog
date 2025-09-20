import "@/lib/db"; // initialize DB once per server instance
import Blog from "@/models/blog";
import Category from "@/models/category";
import { getServerSideSitemap } from "next-sitemap";
import type { ISitemapField } from "next-sitemap";

export const runtime = "nodejs";

export async function GET() {

  const blogs = await Blog.find().select("slug updatedAt");
  const blogFields: ISitemapField[] = blogs.map((blog: any) => ({
    loc: `https://dailysparks.in/blog/${blog.slug}`,
    lastmod: blog.updatedAt?.toISOString(),
    changefreq: "daily" as const,
    priority: 0.8,
  }));

  const categories = await Category.find().select("title updatedAt");
  console.log("dddd", categories);
  const categoryFields: ISitemapField[] = categories.map((cat: any) => ({
    loc: `https://dailysparks.in/category/${encodeURIComponent(cat.title)}`,
    lastmod: cat.updatedAt?.toISOString(),
    changefreq: "weekly" as const,
    priority: 0.7,
  }));
  console.log("cate", categoryFields);

  const staticFields: ISitemapField[] = [
    {
      loc: "https://dailysparks.in/home",
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
