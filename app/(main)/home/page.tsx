import { Metadata } from "next";
import HomePage from "./HomePage";

export const metadata: Metadata = {
  title: "Daily Sparks – Fresh Ideas, Every Day",
  description:
    "From anime sagas to the latest tech trends and travel escapes across the globe — discover stories that spark inspiration, knowledge, and adventure.",
  alternates: {
    canonical: "https://dailysparks.rushabh.in/",
  },
};

export interface BlogInterface {
  _id?: string;
  title: string;
  image: string;
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
}

export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/blog`, {
    next: { revalidate: 60 },
  });
  const data = await res.json();

  return <HomePage allblogs={data.blogs} />;
}
