import "@/lib/db"; // initialize DB once per server instance
import { dbReady } from "@/lib/db";
import MiniSpark from "@/models/minispark";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Mini Sparks — Short takes and quick reads",
  description: "Bite-sized movie reviews and travel notes in 100–250 words.",
  alternates: { canonical: "https://dailysparks.in/mini-sparks" },
};

export default async function MiniSparksPage() {
  await dbReady;
  const items = await MiniSpark.find().sort({ createdAt: -1 }).limit(60).lean();
  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <header className="mb-6 flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Mini Sparks</h1>
          <p className="text-muted-foreground">Bite-sized reviews and experiences.</p>
        </div>
        <Link href="/mini-sparks/add" className="text-sm text-primary underline">Write a Mini Spark →</Link>
      </header>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it: any) => (
          <Link
            key={it._id}
            href={`/mini-sparks/${encodeURIComponent(it.slug)}`}
            className="rounded-xl border border-border bg-card hover:shadow-sm transition overflow-hidden"
          >
            {it.image ? (
              <div className="relative w-full aspect-[16/9]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.image} alt={it.imageAlt || it.title} className="w-full h-full object-cover" />
              </div>
            ) : null}
            <div className="p-4 text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                {it.kind}
              </span>
              {it.format ? (
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                  {it.format === "tvseries" ? "TV Series" : "Movie"}
                </span>
              ) : null}
              {it.language ? (
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                  {it.language}
                </span>
              ) : null}
              <span>{new Date(it.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="px-4 pb-4">
              <h2 className="font-semibold line-clamp-2">{it.title}</h2>
              <p
                className="mt-2 text-sm text-muted-foreground line-clamp-4"
                dangerouslySetInnerHTML={{ __html: it.content }}
              />
              {typeof it.rating === "number" && (
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <div className="h-1.5 w-24 rounded bg-slate-200">
                    <div
                      className="h-1.5 rounded bg-amber-500"
                      style={{ width: `${Math.max(0, Math.min(100, it.rating * 10))}%` }}
                    />
                  </div>
                  <span className="text-muted-foreground">{(Math.round(it.rating * 10) / 10).toFixed(1)}/10</span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
