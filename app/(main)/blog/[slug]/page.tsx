import { connectDB } from "@/lib/db";
import { BlogInterface } from "../../home/page";
import BlogDetailsPage from "./BlogDetailsPage";
import Bloga from "@/models/blog";
import { Metadata } from "next";
import he from "he";
import { apiUrl } from "@/lib/server-url";
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

const SITE = "https://dailysparks.in";

const canonicalFor = (slug: string) =>
  new URL(`/blog/${encodeURIComponent(slug)}`, SITE).toString();

export async function generateMetadata({ params }: any): Promise<Metadata> {
  await connectDB();
  const blog = await Bloga.findOne({ slug: params.slug });

  if (!blog) {
    const notFoundUrl = canonicalFor(params.slug);
    return {
      title: "Blog Not Found",
      description: "This blog could not be found.",
      alternates: { canonical: notFoundUrl },
      metadataBase: new URL(SITE),
      robots: { index: false, follow: false },
    };
  }

  const title = he.decode(blog.metaTitle || blog.title);
  const description =
    blog.metaDescription || blog.content.replace(/<[^>]+>/g, "").slice(0, 160);

  const canonical = canonicalFor(params.slug);
  const imageAbs = blog.image?.startsWith("http")
    ? blog.image
    : new URL(blog.image || "/og-default.jpg", SITE).toString();

  return {
    title,
    description,
    alternates: { canonical },
    metadataBase: new URL(SITE),
    openGraph: {
      title,
      description,
      url: canonical,
      images: [{ url: imageAbs }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageAbs],
    },
  };
}

export default async function Blog({ params }: any) {
  const { slug } = params;

  const blogRes = await fetch(apiUrl(`/blog/${slug}`), {
    next: { revalidate: 60 },
  });
  const blogData = await blogRes.json();

  const tags = (blogData?.blog?.tags || []).join(",");
  const titleQ = encodeURIComponent(
    `${blogData?.blog?.title || ""} ${blogData?.blog?.metaTitle || ""}`.trim()
  );
  const relatedUrl =
    `${apiUrl("/blog/related")}?excludeSlug=${slug}` +
    (blogData?.blog?.category
      ? `&category=${encodeURIComponent(blogData.blog.category)}`
      : "") +
    (tags ? `&tags=${encodeURIComponent(tags)}` : "") +
    (titleQ ? `&title=${titleQ}` : "") +
    `&limit=6`;
  const relatedRes = await fetch(relatedUrl, { next: { revalidate: 60 } });

  const relatedData = await relatedRes.json();
  const related = relatedData.filter((b: BlogInterface) => b.slug !== slug);

  return (
    <BlogDetailsPage blogDetail={blogData.blog} relatedAllBlogs={related} />
  );
}
