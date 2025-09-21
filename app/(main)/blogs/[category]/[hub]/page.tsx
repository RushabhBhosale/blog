import Link from "next/link";
import { getPostsByHub } from "@/lib/content";

export const revalidate = 60;

export default async function HubPage(context: {
  params: Promise<{ category: string; hub: string }>;
}) {
  const { category, hub } = await context.params;
  const { posts, hub: hubDoc } = await getPostsByHub(category, hub);
  if (!hubDoc) return null;
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <ol className="flex items-center gap-1 flex-wrap">
          <li className="flex items-center">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span className="mx-2">›</span>
          </li>
          <li className="flex items-center">
            <Link
              href={`/blogs/${encodeURIComponent(category)}`}
              className="hover:underline"
            >
              {category}
            </Link>
            <span className="mx-2">›</span>
          </li>
          <li className="text-foreground truncate max-w-full">
            {hubDoc.title}
          </li>
        </ol>
      </nav>

      <h1 className="text-3xl font-semibold">{hubDoc.title}</h1>
      {hubDoc.description ? (
        <p className="mt-2 text-neutral-500">{hubDoc.description}</p>
      ) : null}
      <ul className="mt-6 space-y-4">
        {posts.map((p: any) => (
          <li key={p.slug}>
            <Link
              href={`/blogs/${encodeURIComponent(p.category)}/${encodeURIComponent(hub)}/${encodeURIComponent(p.slug)}`}
              className="underline"
            >
              {p.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
