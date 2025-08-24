import { connectDB } from "@/lib/db";
import { BlogInterface } from "../../home/page";
import BlogDetailsPage from "./BlogDetailsPage";
import Bloga from "@/models/blog";
import { Metadata } from "next";
import he from "he";
export const dynamic = "force-dynamic";
export const revalidate = 60;

export interface CommentInterface {
  _id: string;
  comment: string;
  user: {
    name: string;
    email: string;
    imageUrl?: string;
    _id?: string;
  };
  username: string;
  createdAt: string;
}

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connectDB();
  const blog = await Bloga.findOne({ slug: params.slug });

  if (!blog) {
    return {
      title: "Blog Not Found",
      description: "This blog could not be found.",
    };
  }

  const cleanDescription = blog.content.replace(/<[^>]+>/g, "").slice(0, 160);
  const cleanTitle = he.decode(blog.title);

  return {
    title: cleanTitle,
    description: cleanDescription,
    openGraph: {
      title: cleanTitle,
      description: cleanDescription,
      images: [blog.image],
    },
    twitter: {
      card: "summary_large_image",
      title: cleanTitle,
      description: cleanDescription,
      images: [blog.image],
    },
  };
}

export default async function Blog({ params }: any) {
  const { slug } = params;

  const blogRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/blog/${slug}`,
    {
      next: { revalidate: 60 },
    }
  );
  const blogData = await blogRes.json();

  const relatedRes = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_BASE
    }/blog/related?category=${encodeURIComponent(
      blogData.blog.category
    )}&excludeSlug=${slug}`,
    { next: { revalidate: 60 } }
  );

  const relatedData = await relatedRes.json();
  const related = relatedData.filter((b: BlogInterface) => b.slug !== slug);

  return (
    <BlogDetailsPage blogDetail={blogData.blog} relatedAllBlogs={related} />
  );
}
