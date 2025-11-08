import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogInterface } from "../../home/page";
import ViewCounter from "@/components/blog/ViewCounter";
import { prepareArticleContent, TocItem } from "@/lib/article-content";
import { formatPostDate } from "@/lib/date-format";
import BlogActionsBar from "./BlogActionsBar";
import CommentsSection from "@/components/blog/CommentsSection";

const SITE = "https://dailysparks.in";

type Props = {
  blogDetail: BlogInterface & {
    viewCount?: number;
    readingTimeMinutes?: number;
    wordCount?: number;
  };
  relatedAllBlogs: BlogInterface[];
};

const readingTimeFromBlog = (blog: Props["blogDetail"]) => {
  if (typeof blog.readingTimeMinutes === "number" && blog.readingTimeMinutes > 0) {
    return blog.readingTimeMinutes;
  }
  const words = (blog.content || "")
    .replace(/<[^>]+>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

const canonicalPath = (blog: Props["blogDetail"]) => `/blog/${encodeURIComponent(blog.slug || "")}`;

const formatDate = (value?: string) => formatPostDate(value);

export default function BlogDetailsPage({ blogDetail, relatedAllBlogs }: Props) {
  const readingTime = readingTimeFromBlog(blogDetail);
  const likeIds = Array.isArray(blogDetail.likes)
    ? blogDetail.likes.map((id: any) => id?.toString()).filter(Boolean)
    : [];
  const sharePath = canonicalPath(blogDetail);
  const shareUrl = `${SITE}${sharePath}`;
  const { html, toc } = prepareArticleContent(blogDetail.content || "");
  const hasToc = toc.length >= 2;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-12 flex flex-col md:flex-row gap-8">
      <div className="md:w-3/4 flex flex-col gap-6 md:gap-6">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground -mb-2">
          <ol className="flex items-center gap-1 flex-nowrap overflow-x-auto no-scrollbar">
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
                  href={`/blogs/${encodeURIComponent(blogDetail.category)}/${encodeURIComponent(
                    blogDetail.hub.slug,
                  )}`}
                  className="hover:underline"
                >
                  {blogDetail.hub.title || blogDetail.hub.slug}
                </Link>
                <span className="mx-2">›</span>
              </li>
            )}
            <li className="text-foreground truncate max-w-full">{blogDetail.title}</li>
          </ol>
        </nav>

        <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] md:aspect-[16/9] lg:aspect-[21/9] rounded-xl shadow-lg overflow-hidden bg-muted">
          <Image
            src={blogDetail.image}
            alt={blogDetail.imageAlt || `${blogDetail.title} hero image`}
            fill
            sizes="100vw"
            className="object-cover"
            priority
            fetchPriority="high"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="md:mb-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="hidden md:block px-2 py-1 bg-card/50 rounded-full">
              {blogDetail.category}
            </span>
            <Link
              href={`/author/${encodeURIComponent(
                (blogDetail.author || "")
                  .trim()
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/gi, "-")
                  .replace(/^-+|-+$/g, ""),
              )}`}
              className="hover:underline"
            >
              By {blogDetail.author}
            </Link>
            <span>{formatDate(blogDetail.createdAt)}</span>
            <span className="hidden md:block">• {readingTime} min read</span>
            <ViewCounter slug={blogDetail.slug || ""} initialViews={blogDetail.viewCount || 0} />
          </div>

          <BlogActionsBar
            slug={blogDetail.slug || ""}
            likeIds={likeIds}
            shareUrl={shareUrl}
            title={blogDetail.title}
            authorId={blogDetail.authorId}
          />
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground md:mb-6">
          {blogDetail.title}
        </h1>

        <article
          className="prose prose-slate max-w-full text-foreground novel-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <div className="mt-8 flex flex-wrap gap-3">
          {(blogDetail.tags || []).map((tag) => (
            <span key={tag} className="px-3 py-1 bg-black/50 text-white rounded-full text-sm">
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
                <details key={idx} className="group rounded-md border border-border bg-card/60 p-4">
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

        <Suspense
          fallback={
            <section className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">
              Loading comments…
            </section>
          }
        >
          <CommentsSection slug={blogDetail.slug || ""} />
        </Suspense>
      </div>

      <aside className="md:w-1/4 w-full flex flex-col gap-4 sticky top-24 self-start">
        {hasToc ? <TocPanel toc={toc} /> : null}

        <div className="rounded-xl border border-border bg-card/80 p-4 shadow-sm min-h-[320px]">
          <h3 className="font-semibold text-lg mb-2">Related Blogs</h3>
          {relatedAllBlogs.length ? (
            <div className="grid grid-cols-1 gap-3">
              {relatedAllBlogs.map((b) => {
                const path = `/blog/${encodeURIComponent((b as any)?.slug || "")}`;
                return (
                  <Link
                    key={b._id}
                    href={path}
                    className="flex bg-card/70 border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
                  >
                    <div className="relative w-24 h-20 overflow-hidden shrink-0">
                      <Image
                        src={b.image}
                        alt={b.imageAlt || b.title}
                        fill
                        sizes="160px"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-2">
                      <h4 className="text-sm font-medium text-foreground line-clamp-2">{b.title}</h4>
                      <span className="text-xs text-muted-foreground">By {b.author}</span>
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

const TocPanel = ({ toc }: { toc: TocItem[] }) => (
  <div className="space-y-3">
    <nav
      aria-label="On this page"
      className="hidden md:block rounded-xl border border-border bg-card/80 p-4 shadow-sm"
    >
      <h3 className="text-sm font-semibold text-foreground">On this page</h3>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {toc.map((item) => (
          <li key={item.id} className={item.level === 3 ? "ml-3" : undefined}>
            <a href={`#${item.id}`} className="block hover:text-primary transition-colors">
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
          <li key={item.id} className={item.level === 3 ? "ml-3" : undefined}>
            <a href={`#${item.id}`} className="block hover:text-primary transition-colors">
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </details>
  </div>
);
