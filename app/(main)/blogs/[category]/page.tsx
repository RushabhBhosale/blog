import CategoryPage from "./Category";
import "@/lib/db"; // initialize DB once per server instance
import { dbReady } from "@/lib/db";
import Blog from "@/models/blog";
import type { Metadata } from "next";
import { cache } from "react";

export interface BlogInterface {
  _id?: string;
  title: string;
  image: string;
  imageAlt?: string;
  category: string;
  tags: string[];
  content: string;
  author?: string;
  slug?: string;
  authorId?: string;
  createdAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  likes: any;
  comment: any;
  enableFaqSchema?: boolean;
  faqs?: { question: string; answer: string }[];
  hub?: { slug?: string; title?: string };
}

const SITE = "https://dailysparks.in";

const fetchCategoryBlogs = cache(async (rawCategory: string) => {
  await dbReady;
  const regex = new RegExp(
    `^${rawCategory.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
    "i",
  );
  const blogs = await Blog.find({ category: regex, status: "Published" })
    .select("-content")
    .sort({ createdAt: -1 })
    .lean();
  return blogs;
});

export async function generateMetadata(context: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await context.params;
  const canonical = new URL(
    `/blogs/${encodeURIComponent(category)}`,
    SITE,
  ).toString();

  const decoded = decodeURIComponent(category);

  const blogs = await fetchCategoryBlogs(decoded);
  const topBlog = blogs?.[0];
  const displayName =
    decoded.charAt(0).toUpperCase() + decoded.slice(1).toLowerCase();
  const title = `${displayName} Articles & Stories — Daily Sparks`;
  const description = topBlog
    ? `Explore ${displayName} with picks like “${topBlog.title}” plus ${Math.max(
        blogs.length - 1,
        0,
      )} more fresh reads on Daily Sparks.`
    : `Discover the latest ${displayName} insights and stories curated by Daily Sparks.`;

  const imageAbs =
    topBlog?.image && topBlog.image.startsWith("http")
      ? topBlog.image
      : topBlog?.image
        ? new URL(topBlog.image, SITE).toString()
        : new URL("/og-cover.png", SITE).toString();

  return {
    title,
    description,
    alternates: { canonical },
    metadataBase: new URL(SITE),
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images: imageAbs ? [{ url: imageAbs }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageAbs ? [imageAbs] : undefined,
    },
    keywords: [
      displayName,
      `${displayName} blogs`,
      `${displayName} stories`,
      "Daily Sparks",
    ],
  };
}

export default async function Category(context: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await context.params;
  const decoded = decodeURIComponent(category);
  const blogs = await fetchCategoryBlogs(decoded);

  return (
    <CategoryPage
      allblogs={JSON.parse(JSON.stringify(blogs))}
      category={decoded}
    />
  );
}
