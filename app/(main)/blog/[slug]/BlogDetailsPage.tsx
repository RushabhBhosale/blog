"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BlogInterface } from "../../home/page";
import LikeButton from "@/components/blog/LikeButton";
import ShareMenu from "@/components/blog/ShareMenu";
import ViewCounter from "@/components/blog/ViewCounter";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/utils/useAuth";

const CommentsSection = dynamic(
  () => import("@/components/blog/CommentsSection"),
  {
    ssr: false,
    loading: () => (
      <section className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">
        Loading comments…
      </section>
    ),
  }
);

const SITE = "https://dailysparks.in";

function pathFor(blog: BlogInterface & { hub?: any }) {
  return (blog as any)?.hub?.slug && blog.category
    ? `/blogs/${encodeURIComponent(blog.category)}/${encodeURIComponent(
        (blog as any).hub.slug!
      )}/${encodeURIComponent(blog.slug || "")}`
    : `/blog/${encodeURIComponent(blog.slug || "")}`;
}

function pickRelated(related: BlogInterface[], category?: string, count = 2) {
  const seen = new Set<string>();
  const picks: BlogInterface[] = [];
  const normalizedCategory = category?.toLowerCase().trim();

  related.forEach((item) => {
    const slug = item?.slug;
    if (!slug || seen.has(slug) || picks.length >= count) return;
    if (
      normalizedCategory &&
      (item?.category || "").toLowerCase().trim() !== normalizedCategory
    ) {
      return;
    }
    seen.add(slug);
    picks.push(item);
  });

  return picks;
}

function buildInlineHTML(links: { href: string; title: string }[]) {
  if (!links.length) return "";

  const items =
    links.length === 1
      ? `<a href="${links[0].href}" class="text-primary underline-offset-2 hover:underline">${links[0].title}</a>`
      : links
          .map(
            (link, index) =>
              `${index === links.length - 1 ? "and " : ""}<a href="${
                link.href
              }" class="text-primary underline-offset-2 hover:underline">${
                link.title
              }</a>`
          )
          .join(", ");

  return `
  <aside data-ds-related="1" class="not-prose mt-6 mb-8 text-[15px] leading-relaxed text-muted-foreground">
    If you liked this post, check out ${items}.
  </aside>`;
}

function injectRelatedIntoHtml(
  html: string,
  related: BlogInterface[],
  category?: string,
) {
  if (!html || !related?.length) return html;

  const picks = pickRelated(related, category, 2).map((blog) => ({
    href: pathFor(blog),
    title: blog.title,
  }));

  if (!picks.length) return html;

  if (typeof window !== "undefined" && "DOMParser" in window) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      if (doc.querySelector('[data-ds-related="1"]')) return html;

      const paragraphs = Array.from(
        doc.querySelectorAll("p"),
      ).filter((p) => p.innerText.trim().length > 0);

      const target =
        paragraphs[2] ||
        paragraphs[paragraphs.length - 1] ||
        doc.querySelector("h2") ||
        doc.body.firstElementChild;

      const wrapper = doc.createElement("div");
      wrapper.innerHTML = buildInlineHTML(picks);
      const node = wrapper.firstElementChild;

      if (target?.parentNode && node) {
        target.parentNode.insertBefore(node, target.nextSibling);
        return doc.body.innerHTML;
      }
    } catch {
      // noop — fall back to string injection
    }
  }

  const marker = "</p>";
  let count = 0;
  let cursor = 0;
  let insertAt = -1;

  while (true) {
    const nextIndex = html.indexOf(marker, cursor);
    if (nextIndex === -1) break;
    count += 1;
    cursor = nextIndex + marker.length;
    if (count === 3) {
      insertAt = cursor;
      break;
    }
  }

  if (insertAt === -1 && count > 0) {
    insertAt = cursor;
  }

  if (insertAt !== -1) {
    const before = html.slice(0, insertAt);
    const after = html.slice(insertAt);
    return `${before}${buildInlineHTML(picks)}${after}`;
  }

  return `${buildInlineHTML(picks)}${html}`;
}

type Props = {
  blogDetail: BlogInterface & {
    viewCount?: number;
    readingTimeMinutes?: number;
    wordCount?: number;
  };
  relatedAllBlogs: BlogInterface[];
};

function readingTimeFromBlog(blog: Props["blogDetail"]) {
  if (
    typeof blog.readingTimeMinutes === "number" &&
    blog.readingTimeMinutes > 0
  ) {
    return blog.readingTimeMinutes;
  }
  const words = (blog.content || "")
    .replace(/<[^>]+>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function canonicalPath(blog: Props["blogDetail"]) {
  if (blog.hub?.slug && blog.category) {
    return `/blogs/${encodeURIComponent(blog.category)}/${encodeURIComponent(
      blog.hub.slug
    )}/${encodeURIComponent(blog.slug || "")}`;
  }
  return `/blog/${encodeURIComponent(blog.slug || "")}`;
}

export default function BlogDetailsPage({
  blogDetail,
  relatedAllBlogs,
}: Props) {
  const { user } = useAuth();
  const readingTime = readingTimeFromBlog(blogDetail);
  const likeIds = Array.isArray(blogDetail.likes)
    ? blogDetail.likes.map((id: any) => id?.toString()).filter(Boolean)
    : [];
  const sharePath = canonicalPath(blogDetail);
  const shareUrl = `${SITE}${sharePath}`;
  const blogAuthorId = blogDetail.authorId
    ? typeof blogDetail.authorId === "string"
      ? blogDetail.authorId
      : (blogDetail.authorId as any)?.toString?.() ?? ""
    : "";
  const authUserId = user?.userId ? String(user.userId) : "";
  const isOwner = Boolean(
    authUserId && blogAuthorId && authUserId === blogAuthorId
  );
  const isAdmin = (user?.role || "").toString().toLowerCase() === "admin";
  const canEdit = Boolean(blogDetail.slug && (isOwner || isAdmin));
  const tags = Array.isArray(blogDetail.tags) ? blogDetail.tags : [];

  const [toc, setToc] = useState<
    Array<{ id: string; text: string; level: number }>
  >([]);

  const slugify = useMemo(
    () => (str: string) =>
      str
        .toLowerCase()
        .trim()
        .replace(/[\s/|]+/g, "-")
        .replace(/&/g, "and")
        .replace(/[^\w-]+/g, "")
        .replace(/-{2,}/g, "-")
        .replace(/^-+|-+$/g, ""),
    []
  );

  useEffect(() => {
    const article = document.querySelector<HTMLElement>(".novel-content");
    if (!article) return;

    const headings = Array.from(
      article.querySelectorAll<HTMLElement>("h2, h3")
    ).filter((heading) => heading.innerText.trim().length > 0);

    if (!headings.length) {
      setToc([]);
      return;
    }

    const usedIds = new Map<string, number>();
    const items: Array<{ id: string; text: string; level: number }> = [];

    headings.forEach((heading, index) => {
      const baseRaw = slugify(heading.innerText);
      const baseId = baseRaw || heading.id || `section-${index + 1}`;
      const count = usedIds.get(baseId) || 0;
      const uniqueId = count === 0 ? baseId : `${baseId}-${count + 1}`;
      usedIds.set(baseId, count + 1);

      if (!heading.id) heading.id = uniqueId;
      items.push({
        id: heading.id,
        text: heading.innerText,
        level: heading.tagName === "H3" ? 3 : 2,
      });
    });

    setToc(items);
  }, [blogDetail.slug, blogDetail.content, slugify]);

  const hasToc = toc.length >= 2;

  const enhancedHtml = useMemo(
    () =>
      injectRelatedIntoHtml(
        blogDetail.content || "",
        relatedAllBlogs,
        blogDetail.category,
      ),
    [blogDetail.content, relatedAllBlogs, blogDetail.category],
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-12 flex flex-col md:flex-row gap-8">
      <div className="md:w-3/4 flex flex-col gap-6 md:gap-6">
        <nav
          aria-label="Breadcrumb"
          className="text-sm text-muted-foreground -mb-2"
        >
          <ol className="flex items-center gap-1 flex-wrap">
            <li className="flex items-center">
              <Link href="/" className="hover:underline">
                Home
              </Link>
              <span className="mx-2">›</span>
            </li>
            {blogDetail.category && (
              <li className="flex items-center">
                <Link
                  href={`/blogs/${encodeURIComponent(blogDetail.category)}`}
                  className="hover:underline"
                >
                  {blogDetail.category}
                </Link>
                <span className="mx-2">›</span>
              </li>
            )}
            {blogDetail.hub?.slug && (
              <li className="flex items-center">
                <Link
                  href={`/blogs/${encodeURIComponent(
                    blogDetail.category
                  )}/${encodeURIComponent(blogDetail.hub.slug)}`}
                  className="hover:underline"
                >
                  {blogDetail.hub.title || blogDetail.hub.slug}
                </Link>
                <span className="mx-2">›</span>
              </li>
            )}
            <li className="text-foreground truncate max-w-full">
              {blogDetail.title}
            </li>
          </ol>
        </nav>

        <div className="relative w-full h-56 sm:h-64 md:h-96 rounded-xl shadow-lg overflow-hidden">
          <Image
            src={blogDetail.image}
            alt={blogDetail.imageAlt || blogDetail.title}
            fill
            sizes="(max-width: 768px) 100vw, 75vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="md:mb-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="px-2 py-1 bg-card/50 rounded-full">
              {blogDetail.category}
            </span>
            <Link
              href={`/author/${encodeURIComponent(
                (blogDetail.author || "")
                  .trim()
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/gi, "-")
                  .replace(/^-+|-+$/g, "")
              )}`}
              className="hover:underline"
            >
              By {blogDetail.author}
            </Link>
            <span>{new Date(blogDetail.createdAt!).toLocaleDateString()}</span>
            <span>• {readingTime} min read</span>
            <ViewCounter
              slug={blogDetail.slug || ""}
              initialViews={blogDetail.viewCount || 0}
            />
          </div>

          <div className="flex items-center gap-2">
            <LikeButton slug={blogDetail.slug || ""} initialLikes={likeIds} />
            <ShareMenu url={shareUrl} title={blogDetail.title} />
            {canEdit && (
              <Link
                href={`/blog/${encodeURIComponent(blogDetail.slug || "")}/edit`}
              >
                <Button size="sm" variant="outline">
                  Edit
                </Button>
              </Link>
            )}
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground md:mb-6">
          {blogDetail.title}
        </h1>

        <article
          className="prose prose-slate max-w-full text-foreground novel-content"
          dangerouslySetInnerHTML={{ __html: enhancedHtml }}
        />

        <div className="mt-8 flex flex-wrap gap-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-black/50 text-white rounded-full text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>

        {blogDetail?.enableFaqSchema && (blogDetail?.faqs?.length || 0) > 0 && (
          <section className="mt-10 border-t border-border pt-6">
            <h2 className="text-xl sm:text-2xl font-semibold md:mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {blogDetail.faqs!.map((faq, idx) => (
                <details
                  key={idx}
                  className="group rounded-md border border-border bg-card/60 p-4"
                >
                  <summary className="cursor-pointer list-none font-medium text-foreground flex items-center justify-between">
                    <span>{faq.question}</span>
                    <span className="ml-3 text-muted-foreground transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div className="mt-3 text-sm text-muted-foreground whitespace-pre-line">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        <CommentsSection slug={blogDetail.slug || ""} />
      </div>

      <aside className="md:w-1/4 w-full flex flex-col gap-4 sticky top-24 self-start">
        {/* {hasToc ? (
          <div className="space-y-3">
            <nav
              aria-label="On this page"
              className="hidden md:block rounded-xl border border-border bg-card/80 p-4 shadow-sm"
            >
              <h3 className="text-sm font-semibold text-foreground">
                On this page
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {toc.map((item) => (
                  <li key={item.id} className={item.level === 3 ? "ml-3" : ""}>
                    <a
                      href={`#${item.id}`}
                      className="block hover:text-primary transition-colors"
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <details className="md:hidden rounded-xl border border-border bg-card/80 p-4 shadow-sm">
              <summary className="text-sm font-semibold text-foreground cursor-pointer">
                On this page
              </summary>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {toc.map((item) => (
                  <li key={item.id} className={item.level === 3 ? "ml-3" : ""}>
                    <a
                      href={`#${item.id}`}
                      className="block hover:text-primary transition-colors"
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          </div>
        ) : null} */}

        <div>
          <h3 className="font-semibold text-lg mb-2">Related Blogs</h3>
          {relatedAllBlogs.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3">
              {relatedAllBlogs.map((b) => {
                const path = (b as any)?.hub?.slug
                  ? `/blogs/${encodeURIComponent(
                      b.category
                    )}/${encodeURIComponent(
                      (b as any).hub.slug
                    )}/${encodeURIComponent(b.slug || "")}`
                  : `/blog/${b.slug}`;
                return (
                  <Link
                    key={b._id}
                    href={path}
                    className="flex bg-card/70 border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
                  >
                    <div className="relative w-24 h-full overflow-hidden shrink-0">
                      <Image
                        src={b.image}
                        alt={b.imageAlt || b.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-2">
                      <h4 className="text-sm font-medium text-foreground line-clamp-2">
                        {b.title}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        By {b.author}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No related blogs.</p>
          )}
        </div>
      </aside>
    </div>
  );
}
