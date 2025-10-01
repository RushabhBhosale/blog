import "@/lib/db"; // initialize DB once per server instance
import { dbReady } from "@/lib/db";
import MiniSpark from "@/models/minispark";
import Link from "next/link";
import Script from "next/script";
import MiniSparkWriteLink from "@/components/MiniSparkWriteLink";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Mini Sparks — Short takes and quick reads",
  description: "Bite-sized movie reviews and travel notes in 100–200 words.",
  alternates: { canonical: "https://dailysparks.in/mini-sparks" },
};

export default async function MiniSparksPage() {
  await dbReady;
  const items = await MiniSpark.find().sort({ createdAt: -1 }).limit(60).lean();
  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <Script
        id="jsonld-minisparks-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://dailysparks.in",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Mini Sparks",
                item: "https://dailysparks.in/mini-sparks",
              },
            ],
          }),
        }}
      />
      <header className="mb-6 flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Mini Sparks</h1>
          <p className="text-muted-foreground">
            Bite-sized reviews and experiences.
          </p>
        </div>
        <MiniSparkWriteLink />
      </header>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No Mini Sparks yet.</p>
      ) : (
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it: any) => (
            <Link
              key={it._id}
              href={`/mini-sparks/${encodeURIComponent(it.slug)}`}
              className="group rounded-lg border border-border bg-card hover:shadow-md hover:border-primary/20 transition-all overflow-hidden flex flex-col"
            >
              {it.image ? (
                <div className="relative w-full aspect-[16/9] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={it.image}
                    alt={it.imageAlt || it.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : null}
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-primary/10 text-primary font-semibold uppercase tracking-wide">
                    {it.kind}
                  </span>
                  {it.format && (
                    <span className="text-[10px] text-muted-foreground">
                      {it.format === "tvseries" ? "TV" : "Film"}
                    </span>
                  )}
                  {it.language && (
                    <span className="text-[10px] text-muted-foreground">
                      • {it.language}
                    </span>
                  )}
                </div>

                <h2 className="font-semibold text-base line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                  {it.title}
                </h2>

                <p
                  className="text-sm text-muted-foreground line-clamp-3 mb-3"
                  dangerouslySetInnerHTML={{ __html: it.content }}
                />

                <div className="mt-auto space-y-2">
                  {typeof it.rating === "number" && (
                    <div className="flex items-center gap-2">
                      <div className="h-1 flex-1 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-amber-500"
                          style={{
                            width: `${Math.max(
                              0,
                              Math.min(100, it.rating * 10)
                            )}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-foreground min-w-[2.5rem] text-right">
                        {(Math.round(it.rating * 10) / 10).toFixed(1)}/10
                      </span>
                    </div>
                  )}

                  {Array.isArray(it.tags) && it.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {it.tags.slice(0, 3).map((t: string) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded text-[10px] bg-muted text-muted-foreground"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
