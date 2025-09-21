import CategoryPage from "./Category";
import "@/lib/db"; // initialize DB once per server instance
import { dbReady } from "@/lib/db";
import Blog from "@/models/blog";
import type { Metadata } from "next";

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
}

const SITE = "https://dailysparks.in";

export async function generateMetadata(context: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await context.params;
  const canonical = new URL(
    `/blog/category/${encodeURIComponent(category)}`,
    SITE
  ).toString();

  const title = `Category: ${decodeURIComponent(category)} — Daily Sparks`;
  const description = `Recent posts in ${decodeURIComponent(
    category
  )} on Daily Sparks.`;

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
    },
  };
}

export default async function Category(context: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await context.params;
  console.log("sss", category);
  await dbReady;
  // Case-insensitive exact match for category
  const regex = new RegExp(
    `^${category.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
    "i"
  );
  const blogs = await Blog.find({ category: regex })
    .select("-content")
    .sort({ createdAt: -1 })
    .lean();

  return (
    <CategoryPage
      allblogs={JSON.parse(JSON.stringify(blogs))}
      category={category}
    />
  );
}
