import HomePage from "./HomePage";

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

export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/blog`, {
    next: { revalidate: 60 },
  });
  const data = await res.json();

  return <HomePage allblogs={data.blogs} />;
}
