import "@/lib/db";
import { dbReady } from "@/lib/db";
import MiniSpark from "@/models/minispark";
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import MiniSparkEditButton from "@/components/MiniSparkEditButton";
import ShareButton from "@/components/ShareButton";

const SITE = "https://dailysparks.in";

async function getOne(slug: string) {
  await dbReady;
  return await MiniSpark.findOne({ slug }).lean();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const it: any = await getOne(slug);
  const title = it?.title ? `${it.title} — Mini Sparks` : "Mini Spark";
  const description =
    it?.content
      ?.replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 160) || "A Mini Spark";
  const canonical = new URL(
    `/mini-sparks/${encodeURIComponent(slug)}`,
    SITE
  ).toString();
  return {
    title,
    description,
    alternates: { canonical },
    metadataBase: new URL(SITE),
    openGraph: { title, description, url: canonical },
  };
}

export default async function MiniSparkDetail(context: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await context.params;
  const it: any = await getOne(slug);
  if (!it)
    return <div className="max-w-4xl mx-auto px-4 py-10">Not found.</div>;

  const canonical = new URL(
    `/mini-sparks/${encodeURIComponent(slug)}`,
    SITE
  ).toString();
  const reviewBody = String(it.content || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const itemType =
    it.kind === "movie"
      ? it.format === "tvseries"
        ? "TVSeries"
        : "Movie"
      : "CreativeWork";

  const reviewLd = {
    "@type": "Review",
    name: it.title,
    url: canonical,
    datePublished: it.createdAt
      ? new Date(it.createdAt).toISOString()
      : undefined,
    reviewBody,
    author: it.author ? { "@type": "Person", name: it.author } : undefined,
    itemReviewed: { "@type": itemType, name: it.title },
    ...(typeof it.rating === "number"
      ? {
          reviewRating: {
            "@type": "Rating",
            ratingValue: it.rating,
            bestRating: 10,
            worstRating: 1,
          },
        }
      : {}),
    ...(it.image ? { image: it.image } : {}),
  } as const;

  const breadcrumbLd = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      {
        "@type": "ListItem",
        position: 2,
        name: "Mini Sparks",
        item: new URL("/mini-sparks", SITE).toString(),
      },
      { "@type": "ListItem", position: 3, name: it.title, item: canonical },
    ],
  } as const;

  const dateStr = it.createdAt
    ? new Date(it.createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  const ratingPercent =
    typeof it.rating === "number"
      ? Math.max(0, Math.min(100, it.rating * 10))
      : null;
  const ratingText =
    typeof it.rating === "number"
      ? (Math.round(it.rating * 10) / 10).toFixed(1)
      : null;

  return (
    <main className="max-w-3xl mx-auto px-4 py-6">
      <Script
        id="jsonld-minispark-review"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [reviewLd, breadcrumbLd],
          }),
        }}
      />

      <nav
        aria-label="Breadcrumb"
        className="text-sm text-muted-foreground mb-3"
      >
        <ol className="flex items-center gap-1 flex-wrap">
          <li className="flex items-center">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span className="mx-2">›</span>
          </li>
          <li className="flex items-center">
            <Link href="/mini-sparks" className="hover:underline">
              Mini Sparks
            </Link>
            <span className="mx-2">›</span>
          </li>
          <li className="text-foreground truncate max-w-full">{it.title}</li>
        </ol>
      </nav>

      <header className="flex items-start justify-between gap-3">
        <h1 className="text-2xl font-semibold leading-tight tracking-tight">
          {it.title}
        </h1>
        <div className="flex items-center gap-2 shrink-0">
          <MiniSparkEditButton slug={slug} />
          <ShareButton url={canonical} title={it.title} />
        </div>
      </header>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <Badge tone="primary">{it.kind}</Badge>
        {it.format ? (
          <Badge tone="info">
            {it.format === "tvseries" ? "TV Series" : "Movie"}
          </Badge>
        ) : null}
        {it.language ? <Badge tone="neutral">{it.language}</Badge> : null}
        {dateStr ? (
          <span className="text-muted-foreground">{dateStr}</span>
        ) : null}
        {ratingText && (
          <span className="ms-2 inline-flex items-center gap-2">
            <RatingBar value={ratingPercent!} />
            <span className="text-foreground/80">{ratingText}/10</span>
          </span>
        )}
      </div>

      {it.image ? (
        <figure className="relative w-full mt-4 rounded-xl overflow-hidden border border-border shadow-sm">
          <img
            src={it.image}
            alt={it.imageAlt || it.title}
            className="w-full h-auto object-cover transition-transform duration-300 hover:scale-[1.01]"
          />
        </figure>
      ) : null}

      <article
        className="prose prose-slate max-w-none mt-5 prose-p:leading-relaxed prose-p:text-[15.5px]"
        dangerouslySetInnerHTML={{ __html: it.content }}
      />

      {Array.isArray(it.tags) && it.tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {it.tags.map((t: string) => (
            <Link
              key={t}
              href={`/mini-sparks?tag=${encodeURIComponent(t)}`}
              className="px-2.5 py-1 rounded-full bg-muted text-foreground/90 text-[11px] hover:bg-muted/80 transition"
            >
              #{t}
            </Link>
          ))}
        </div>
      )}

      {it.verdict ? (
        <section className="mt-6 rounded-xl border border-border bg-card/60 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-foreground">Verdict</h3>
            <span className={verdictCls(it.verdict)} />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {it.verdict}
          </p>
        </section>
      ) : null}
    </main>
  );
}

function verdictCls(v: string) {
  const s = v.toLowerCase();
  if (s.includes("must") || s.includes("great") || s.includes("excellent"))
    return "h-2 w-2 rounded-full bg-emerald-500";
  if (s.includes("recommend") || s.includes("good"))
    return "h-2 w-2 rounded-full bg-blue-500";
  if (s.includes("worth") || s.includes("decent"))
    return "h-2 w-2 rounded-full bg-amber-500";
  if (s.includes("skip") || s.includes("avoid"))
    return "h-2 w-2 rounded-full bg-red-500";
  return "h-2 w-2 rounded-full bg-slate-400";
}

function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "primary" | "info" | "neutral";
}) {
  const tones: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    info: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
    neutral:
      "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[12px] font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function RatingBar({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="h-1.5 w-28 rounded bg-slate-200 dark:bg-slate-800 overflow-hidden">
        <span
          className="block h-1.5 rounded bg-amber-500"
          style={{ width: `${value}%` }}
        />
      </span>
    </span>
  );
}
