import { Metadata } from "next";
import "@/lib/db"; // initialize DB once per server instance
import { dbReady } from "@/lib/db";
import User from "@/models/user";
import Blog from "@/models/blog";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import slugify from "slugify";

const SITE = "https://dailysparks.in";

function authorRegexFromSlug(slug: string) {
  // Convert "john-doe" -> /^john[\s_\-]*doe$/i
  const parts = slug
    .split("-")
    .filter(Boolean)
    .map((p) => p.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"));
  const pattern = parts.join("[\\s_\\-]*");
  return new RegExp(`^${pattern}$`, "i");
}

export async function generateMetadata({
  params,
}: {
  params: any;
}): Promise<Metadata> {
  await dbReady;
  const re = authorRegexFromSlug(params.slug);
  const oneBlog: any = await Blog.findOne({ author: re })
    .select("author authorId")
    .lean();
  const name = oneBlog?.author || params.slug.replace(/-/g, " ");
  const canonical = new URL(
    `/author/${encodeURIComponent(params.slug)}`,
    SITE,
  ).toString();
  return {
    title: `${name} — Author at DailySparks`,
    description: `Explore articles by ${name} on DailySparks.`,
    alternates: { canonical },
    metadataBase: new URL(SITE),
    openGraph: {
      title: `${name} — Author at DailySparks`,
      description: `Explore articles by ${name} on DailySparks.`,
      url: canonical,
      type: "profile",
    },
  };
}

export default async function AuthorPage({ params }: { params: any }) {
  const { slug } = params;
  await dbReady;
  const re = authorRegexFromSlug(slug);
  const blogs = await Blog.find({ author: re })
    .sort({ createdAt: -1 })
    .select("title slug image imageAlt category author authorId createdAt")
    .lean();

  let user: any = null;
  if (blogs.length) {
    user = await User.findById(blogs[0].authorId).lean();
  }
  const displayName = blogs[0]?.author || slug.replace(/-/g, " ");
  const canonical = new URL(
    `/author/${encodeURIComponent(slug)}`,
    SITE,
  ).toString();
  const imageUrl = user?.imageUrl ? String(user.imageUrl) : undefined;

  // Gather quick stats
  const postCount = blogs.length;
  const categories = Array.from(
    new Set(blogs.map((b: any) => b.category)),
  ).sort();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Script
        id="jsonld-author"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Person",
                name: displayName,
                url: canonical,
                ...(imageUrl ? { image: imageUrl } : {}),
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: SITE,
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: displayName,
                    item: canonical,
                  },
                ],
              },
            ],
          }),
        }}
      />
      <nav
        aria-label="Breadcrumb"
        className="text-sm text-muted-foreground mb-4"
      >
        <ol className="flex items-center gap-1 flex-wrap">
          <li className="flex items-center">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span className="mx-2">›</span>
          </li>
          <li className="text-foreground">{displayName}</li>
        </ol>
      </nav>
      <header className="flex items-start gap-4 md:gap-6 mb-8">
        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border border-border bg-card">
          {user?.imageUrl ? (
            <Image
              src={user.imageUrl}
              alt={displayName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl md:text-2xl font-semibold bg-muted text-foreground">
              {displayName?.[0]?.toUpperCase() || "A"}
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {displayName}
          </h1>
          <p className="text-muted-foreground mt-1">Author at DailySparks</p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-3">
            <span>
              {postCount} {postCount === 1 ? "post" : "posts"}
            </span>
            {user?.createdAt && (
              <span>
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
          {categories.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((c) => (
                <Link
                  key={c}
                  href={`/blog/category/${encodeURIComponent(c)}`}
                  className="px-2 py-1 rounded-full border border-border text-xs hover:bg-accent"
                >
                  {c}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      {blogs.length === 0 ? (
        <p className="text-muted-foreground">No posts yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((b: any) => (
            <Link
              key={b._id}
              href={`/blog/${encodeURIComponent(b.slug)}`}
              className="group rounded-lg overflow-hidden border border-border bg-card/70 hover:shadow-md transition"
            >
              <div className="relative w-full h-44">
                <Image
                  src={b.image}
                  alt={b.imageAlt || b.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <div className="text-xs text-muted-foreground mb-1">
                  {b.category}
                </div>
                <h2 className="text-base font-semibold line-clamp-2 group-hover:underline">
                  {b.title}
                </h2>
                <div className="text-xs text-muted-foreground mt-2">
                  By {b.author} • {new Date(b.createdAt).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
