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

  return (
    <BlogDetailsPage blogDetail={blogData.blog} relatedAllBlogs={relatedData} />
  );
}
