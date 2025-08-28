import BlogsPage from "./BlogsPage";

export default async function Blogs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/blog`, {
    next: { revalidate: 60 },
  });
  const data = await res.json();

  return <BlogsPage allblogs={data.blogs} />;
}
