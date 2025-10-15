"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { BlogInterface } from "./page";

type Props = {
  allblogs: BlogInterface[];
  category: string;
};

const SITE = "https://dailysparks.in";

const HERO_COPY: Record<string, string> = {
  anime:
    "Character studies, release calendars, and thoughtful takes from the anime beat.",
  tech: "Hands-on breakdowns, engineering workflows, and product deep-dives from builders.",
  travel: "Itineraries, city guides, and first-hand adventures across the globe.",
  lifestyle: "Practical habits, inspiration, and culture picks to elevate daily living.",
  seo: "Organic growth experiments, playbooks, and frameworks for smarter search wins.",
};

const titleCase = (value: string) =>
  value
    .split(/[\s_-]+/)
    .map((part) =>
      part ? part[0].toUpperCase() + part.slice(1).toLowerCase() : "",
    )
    .join(" ");

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const blogUrl = (blog: BlogInterface) => {
  if ((blog as any)?.hub?.slug && blog.category) {
    return `/blogs/${encodeURIComponent(blog.category)}/${encodeURIComponent(
      (blog as any).hub.slug!,
    )}/${encodeURIComponent(blog.slug || "")}`;
  }
  return `/blog/${blog.slug}`;
};

export default function CategoryPage({ allblogs, category }: Props) {
  const blogs = allblogs ?? [];
  const hasPosts = blogs.length > 0;

  const displayCategory = useMemo(() => titleCase(category), [category]);
  const categoryKey = displayCategory.toLowerCase();
  const heroCopy =
    HERO_COPY[categoryKey] ||
    `Fresh ${displayCategory.toLowerCase()} ideas, guides, and deep-dives curated by Daily Sparks.`;

  const categorySegment = encodeURIComponent(blogs[0]?.category || category);
  const canonicalCategoryUrl = `${SITE}/blogs/${categorySegment}`;

  const latestPublished = blogs[0]?.createdAt;

  const uniqueAuthorsCount = useMemo(() => {
    const authors = new Set(
      blogs
        .map((blog) => (blog.author || "").trim())
        .filter((name) => name.length > 0),
    );
    return authors.size;
  }, [blogs]);

  const hubList = useMemo(() => {
    const map = new Map<
      string,
      { slug: string; title: string; count: number; category: string }
    >();
    blogs.forEach((blog) => {
      const slug = (blog as any)?.hub?.slug;
      if (!slug || !blog.category) return;
      const key = `${blog.category}::${slug}`;
      const existing = map.get(key) ?? {
        slug,
        title: (blog as any)?.hub?.title || slug,
        count: 0,
        category: blog.category,
      };
      existing.count += 1;
      map.set(key, existing);
    });
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [blogs]);

  const topTags = useMemo(() => {
    const counts = new Map<string, number>();
    blogs.forEach((blog) => {
      (blog.tags || []).forEach((tag) => {
        const label = (tag || "").trim();
        if (!label) return;
        const normalized = label.toLowerCase();
        const canonicalTag =
          Array.from(counts.keys()).find(
            (existing) => existing.toLowerCase() === normalized,
          ) || label;
        counts.set(
          canonicalTag,
          (counts.get(canonicalTag) || 0) + 1,
        );
      });
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [blogs]);

  const [activeTag, setActiveTag] = useState<string>("All");

  const filteredWithoutFeatured = useMemo(() => {
    const rest = blogs.slice(1);
    if (activeTag === "All") return rest;
    const target = activeTag.toLowerCase();
    return rest.filter((blog) =>
      Array.isArray(blog.tags) &&
      blog.tags.some((tag) => tag.toLowerCase() === target),
    );
  }, [blogs, activeTag]);

  const recentBlogs = filteredWithoutFeatured.slice(0, 3);
  const remainingBlogs = filteredWithoutFeatured.slice(3);

  const stats = useMemo(
    () => [
      { label: "Published posts", value: blogs.length.toString() },
      {
        label: "Active writers",
        value: uniqueAuthorsCount ? uniqueAuthorsCount.toString() : "—",
      },
      {
        label: "Collections",
        value: hubList.length ? hubList.length.toString() : "—",
      },
      {
        label: "Updated",
        value: formatDate(latestPublished) || "—",
      },
    ],
    [blogs.length, uniqueAuthorsCount, hubList.length, latestPublished],
  );

  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `${displayCategory} Articles`,
      description: heroCopy,
      url: canonicalCategoryUrl,
      inLanguage: "en",
      breadcrumb: {
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
            name: "Blogs",
            item: `${SITE}/blogs`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: displayCategory,
            item: canonicalCategoryUrl,
          },
        ],
      },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: blogs.length,
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        itemListElement: blogs.map((blog, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: blog.title,
          url: new URL(blogUrl(blog), SITE).toString(),
        })),
      },
    }),
    [blogs, canonicalCategoryUrl, displayCategory, heroCopy],
  );

  const heroBlog = blogs[0];

  return (
    <div className="min-h-screen bg-background">
      <Script
        id="category-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="text-sm text-muted-foreground">
          <ol className="flex items-center gap-1 flex-wrap">
            <li>
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
              <span className="mx-2">›</span>
            </li>
            <li>
              <Link href="/blogs" className="hover:text-primary">
                Blogs
              </Link>
              <span className="mx-2">›</span>
            </li>
            <li className="text-foreground font-medium">{displayCategory}</li>
          </ol>
        </nav>

        {hasPosts ? (
          <section className="mt-8 space-y-8">
            <header className="flex flex-col gap-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                {displayCategory} Stories
              </h1>
              <p className="text-muted-foreground max-w-3xl">{heroCopy}</p>
            </header>

            {heroBlog ? (
              <Link
                href={blogUrl(heroBlog)}
                className="block group relative rounded-3xl overflow-hidden border border-border bg-card"
              >
                <div className="relative h-[280px] sm:h-[360px] md:h-[440px]">
                  {heroBlog.image ? (
                    <Image
                      src={heroBlog.image}
                      alt={heroBlog.imageAlt || heroBlog.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1100px"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-primary/20 to-transparent" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                </div>
                <div className="absolute inset-0 flex flex-col justify-end gap-4 p-6 sm:p-10">
                  <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-white/80">
                    <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm">
                      Spotlight
                    </span>
                    {heroBlog.createdAt ? (
                      <span>{formatDate(heroBlog.createdAt)}</span>
                    ) : null}
                    {heroBlog.author ? <span>• {heroBlog.author}</span> : null}
                  </div>
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white leading-tight max-w-3xl">
                    {heroBlog.title}
                  </h2>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-white/85">
                    Read spotlight
                    <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            ) : null}

            <section>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-border bg-card/60 p-4 sm:p-5 shadow-sm"
                  >
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="mt-3 text-xl font-semibold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </section>
        ) : (
          <section className="mt-12 rounded-3xl border border-dashed border-border bg-card/40 p-10 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              {displayCategory} stories are on the way
            </h1>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              We're lining up the first set of {displayCategory.toLowerCase()} pieces. Meanwhile,
              explore all blogs or pitch a story to be featured here first.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/blogs"
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Browse all blogs
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted/40 transition"
              >
                Pitch a story
              </Link>
            </div>
          </section>
        )}

        {hasPosts && topTags.length > 0 ? (
          <section className="mt-12">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold text-muted-foreground">
                Browse by tag:
              </span>
              <button
                type="button"
                onClick={() => setActiveTag("All")}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition-colors",
                  activeTag === "All"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:border-primary/40",
                )}
              >
                All
              </button>
              {topTags.map(([tag, count]) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(tag)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition-colors",
                    activeTag.toLowerCase() === tag.toLowerCase()
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card hover:border-primary/40",
                  )}
                >
                  #{tag}
                  <span className="ml-1 text-xs text-muted-foreground">
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {hasPosts && filteredWithoutFeatured.length > 0 ? (
          <>
            <section className="mt-12 space-y-8">
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <h2 className="text-2xl font-bold text-foreground">
                  Latest in {displayCategory}
                  {activeTag !== "All" ? ` • #${activeTag}` : ""}
                </h2>
                {activeTag !== "All" ? (
                  <button
                    type="button"
                    onClick={() => setActiveTag("All")}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Clear tag filter
                  </button>
                ) : null}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentBlogs.map((blog) => (
                  <Link
                    key={blog._id}
                    href={blogUrl(blog)}
                    className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-md"
                  >
                    <div className="relative h-48">
                      {blog.image ? (
                        <Image
                          src={blog.image}
                          alt={blog.imageAlt || blog.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent" />
                      )}
                    </div>
                    <div className="p-4 space-y-2">
                      <span className="text-xs uppercase tracking-wide text-primary">
                        {formatDate(blog.createdAt)}
                      </span>
                      <h3 className="text-lg font-semibold text-foreground leading-snug line-clamp-2">
                        {blog.title}
                      </h3>
                      {blog.author ? (
                        <p className="text-sm text-muted-foreground">
                          By {blog.author}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {remainingBlogs.length > 0 ? (
              <section className="mt-12">
                <h2 className="text-2xl font-bold mb-6 text-foreground">
                  All{" "}
                  {activeTag !== "All" ? `#${activeTag} ` : ""}
                  {displayCategory} posts
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {remainingBlogs.map((blog) => (
                    <Link
                      key={blog._id}
                      href={blogUrl(blog)}
                      className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card/70 shadow-sm transition hover:shadow-md"
                    >
                      <div className="relative h-40">
                        {blog.image ? (
                          <Image
                            src={blog.image}
                            alt={blog.imageAlt || blog.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-muted" />
                        )}
                      </div>
                      <div className="p-4 space-y-2">
                        <h3 className="text-base font-semibold text-foreground line-clamp-2">
                          {blog.title}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(blog.createdAt)}
                        </span>
                        {Array.isArray(blog.tags) && blog.tags.length ? (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {blog.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </>
        ) : null}

        {hasPosts &&
        filteredWithoutFeatured.length === 0 &&
        activeTag !== "All" ? (
          <section className="mt-12 rounded-2xl border border-border bg-card/60 p-8 text-center">
            <h2 className="text-xl font-semibold text-foreground">
              No posts tagged #{activeTag} yet
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Try another tag or reset to view every {displayCategory.toLowerCase()} story.
            </p>
            <button
              type="button"
              onClick={() => setActiveTag("All")}
              className="mt-4 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
            >
              Reset filter
            </button>
          </section>
        ) : null}

        {hasPosts && hubList.length > 0 ? (
          <section className="mt-14">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Explore curated collections
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {hubList.map((hub) => (
                <Link
                  key={`${hub.category}-${hub.slug}`}
                  href={`/blogs/${encodeURIComponent(hub.category)}/${encodeURIComponent(hub.slug)}`}
                  className="flex flex-col justify-between rounded-2xl border border-border bg-card/70 p-5 transition hover:shadow-md"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {hub.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {hub.count} {hub.count === 1 ? "story" : "stories"}
                    </p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    View collection
                    <span aria-hidden>→</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-16 rounded-2xl border border-border bg-card/70 p-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between sm:gap-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Have a {displayCategory.toLowerCase()} story to share?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              Pitch your idea and join our contributor roster. We’re always looking for original {displayCategory.toLowerCase()} perspectives.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Pitch your story
            </Link>
            <Link
              href="/signup"
              className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted/40 transition"
            >
              Become a member
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
