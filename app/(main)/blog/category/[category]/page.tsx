import CategoryPage from "./Category";

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
  likes: any;
  comment: any;
}

export default async function Category(context: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await context.params;
  console.log("sss", category);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/blog/category/${category}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    return <div>Category not found</div>;
  }

  const data = await res.json();
  console.log("f", data);

  return <CategoryPage allblogs={data.blogs} category={category} />;
}
