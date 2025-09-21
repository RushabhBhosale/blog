import { Metadata } from "next";
import BlogsPage from "./BlogsPage";
import "@/lib/db"; // initialize DB once per server instance
import { dbReady } from "@/lib/db";
import Blog from "@/models/blog";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Daily Sparks Blogs – Explore Anime, Tech & Travel Stories",
  description:
    "Browse our latest blogs across anime, tech, and travel. Fresh insights, daily updates, and stories to spark curiosity and inspire your journey.",
  alternates: {
    canonical: "https://dailysparks.in/blog",
  },
};

export const revalidate = 60;

export default async function Blogs() {
  await dbReady;
  const blogs = await Blog.find()
    .select("-content")
    .sort({ createdAt: -1 })
    .lean();
  return (
    <Suspense fallback={<div>Loading blogs...</div>}>
      <BlogsPage allblogs={JSON.parse(JSON.stringify(blogs))} />
    </Suspense>
  );
}
