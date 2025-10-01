import "@/lib/db"; // initialize DB once per server instance
import { dbReady } from "@/lib/db";
import MiniSpark from "@/models/minispark";
import type { Metadata } from "next";
import Link from "next/link";

const SITE = "https://dailysparks.in";

async function getOne(slug: string) {
  await dbReady;
  return await MiniSpark.findOne({ slug }).lean();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const it: any = await getOne(slug);
  const title = it?.title ? `${it.title} — Mini Sparks` : "Mini Spark";
  const description = it?.content?.replace(/<[^>]+>/g, " ").slice(0, 160) || "A Mini Spark";
  const canonical = new URL(`/mini-sparks/${encodeURIComponent(slug)}`, SITE).toString();
  return {
    title,
    description,
    alternates: { canonical },
    metadataBase: new URL(SITE),
    openGraph: { title, description, url: canonical },
  };
}

export default async function MiniSparkDetail(context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const it: any = await getOne(slug);
  if (!it) return <div className="max-w-4xl mx-auto px-4 py-10">Not found.</div>;
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-2">
        <ol className="flex items-center gap-1 flex-wrap">
          <li className="flex items-center">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="mx-2">›</span>
          </li>
          <li className="flex items-center">
            <Link href="/mini-sparks" className="hover:underline">Mini Sparks</Link>
            <span className="mx-2">›</span>
          </li>
          <li className="text-foreground truncate max-w-full">{it.title}</li>
        </ol>
      </nav>
      <h1 className="text-2xl font-semibold">{it.title}</h1>
      <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{it.kind}</span>
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
        {typeof it.rating === "number" && (
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-24 rounded bg-slate-200 inline-block">
              <span
                className="block h-1.5 rounded bg-amber-500"
                style={{ width: `${Math.max(0, Math.min(100, it.rating * 10))}%` }}
              />
            </span>
            <span className="text-muted-foreground">{(Math.round(it.rating * 10) / 10).toFixed(1)}/10</span>
          </span>
        )}
      </div>
      {it.image ? (
        <div className="relative w-full mt-4 rounded-lg overflow-hidden border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={it.image} alt={it.imageAlt || it.title} className="w-full h-auto" />
        </div>
      ) : null}
      <article className="prose prose-slate max-w-none mt-4" dangerouslySetInnerHTML={{ __html: it.content }} />
    </main>
  );
}
