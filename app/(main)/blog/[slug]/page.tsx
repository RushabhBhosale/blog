import BlogDetailsPage from "./BlogDetailsPage";

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

interface Props {
  params: { slug: string };
}

export default async function Blog({ params }: Props) {
  const { slug } = params;

  const blogRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/blog/${slug}`,
    {
      cache: "no-store",
    }
  );
  const blogData = await blogRes.json();

  const relatedRes = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_BASE
    }/blog/related?category=${encodeURIComponent(
      blogData.blog.category
    )}&excludeSlug=${slug}`,
    { cache: "no-store" }
  );
  const relatedData = await relatedRes.json();

  return (
    <BlogDetailsPage blogDetail={blogData.blog} relatedAllBlogs={relatedData} />
  );
}
