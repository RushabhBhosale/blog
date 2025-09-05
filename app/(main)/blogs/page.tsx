import { Metadata } from "next";
import BlogsPage from "./BlogsPage";

export const metadata: Metadata = {
  title: "Daily Sparks Blogs – Explore Anime, Tech & Travel Stories",
  description:
    "Browse our latest blogs across anime, tech, and travel. Fresh insights, daily updates, and stories to spark curiosity and inspire your journey.",
  alternates: {
    canonical: "https://dailysparks.in/blog",
  },
};

export default async function Blogs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/blog`, {
    next: { revalidate: 60 },
  });
  const data = await res.json();

  return <BlogsPage allblogs={data.blogs} />;
}
