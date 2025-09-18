import { Metadata } from "next";
import HomePage from "./HomePage";
import { connectDB } from "@/lib/db";
import Blog from "@/models/blog";

export const metadata: Metadata = {
  title: "Daily Sparks – Fresh Ideas, Every Day",
  description:
    "From anime sagas to the latest tech trends and travel escapes across the globe — discover stories that spark inspiration, knowledge, and adventure.",
  alternates: {
    canonical: "https://dailysparks.in/",
  },
};

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

export const revalidate = 60;

export default async function Home() {
  await connectDB();
  const blogs = await Blog.find().select("-content").sort({ createdAt: -1 }).lean();
  return <HomePage allblogs={JSON.parse(JSON.stringify(blogs))} />;
}
