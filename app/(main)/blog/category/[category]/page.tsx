import CategoryPage from "./Category";
import { connectDB } from "@/lib/db";
import Blog from "@/models/blog";

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

export default async function Category(context: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await context.params;
  console.log("sss", category);

  await connectDB();
  // Case-insensitive exact match for category
  const regex = new RegExp(`^${category.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
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
