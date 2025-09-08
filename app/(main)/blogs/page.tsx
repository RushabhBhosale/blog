import { Metadata } from "next";
import BlogsPage from "./BlogsPage";
import { apiUrl } from "@/lib/server-url";

export const metadata: Metadata = {
  title: "Daily Sparks Blogs – Explore Anime, Tech & Travel Stories",
  description:
    "Browse our latest blogs across anime, tech, and travel. Fresh insights, daily updates, and stories to spark curiosity and inspire your journey.",
  alternates: {
    canonical: "https://dailysparks.in/blog",
  },
};

export default async function Blogs() {
  try {
    const res = await fetch(apiUrl("/blog"), { next: { revalidate: 60 } });
    const data = await res.json();
    return <BlogsPage allblogs={data.blogs || []} />;
  } catch {
    // Gracefully render with no data to avoid build-time failure
    return <BlogsPage allblogs={[]} />;
  }
}
