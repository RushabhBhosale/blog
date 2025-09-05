"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BlogInterface } from "./page";
import axiosClient from "@/lib/axiosclient";
import { toast } from "sonner";

type Props = { allblogs: BlogInterface[] };

export default function HomePage({ allblogs }: Props) {
  const blogs = allblogs || [];

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const byCategory = (name: string) =>
    blogs.filter((b) => b.category?.toLowerCase() === name.toLowerCase());

  const spotlight = blogs[0];
  const latest = blogs.slice(1, 9);
  const mustReadMain = blogs[9] || blogs[1];
  const mustReadSide = blogs.slice(10, 13);
  const editorsPick = blogs[13] || blogs[2];

  const anime = byCategory("Anime").slice(0, 4);
  const tech = byCategory("Tech").slice(0, 4);
  const travel = byCategory("Travel").slice(0, 4);

  const categoriesAll = Array.from(
    new Set(blogs.map((b) => b.category))
  ).filter(Boolean);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const subscribe = async () => {
    const trimmed = email.trim();
    if (!/.+@.+\..+/.test(trimmed)) {
      toast.error("Please enter a valid email");
      return;
    }
    try {
      setLoading(true);
      await axiosClient.post("/newsletter/subscribe", { email: trimmed });
      toast.success("Subscribed to Daily Sparks.");
      setEmail("");
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Failed to subscribe");
    } finally {
      setLoading(false);
    }
  };

  const CardSm = ({ b }: { b: BlogInterface }) => (
    <Link href={`/blog/${b.slug}`} className="group block">
      <div className="relative h-32 w-full overflow-hidden rounded-xl">
        <Image
          src={b.image}
          alt={b.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
          {b.category}
        </span>
        <span className="text-[11px] text-muted-foreground">
          {formatDate(b.createdAt)}
        </span>
      </div>
      <h4 className="mt-1 text-sm font-semibold leading-snug line-clamp-2">
        {b.title}
      </h4>
    </Link>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <header className="py-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
            <span className="text-xs font-semibold tracking-wide text-primary">
              DAILY SPARKS
            </span>
            <span className="text-xs text-muted-foreground">
              Anime • Tech • Travel
            </span>
          </div>
          <h1 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight">
            Fresh Ideas, Every Day
          </h1>
          <p className="mt-2 text-muted-foreground">
            Reviews, guides, and stories from our creators.
          </p>
        </header>

        <div className="space-y-12">
          {spotlight && (
            <section className="rounded-2xl overflow-hidden border border-border bg-card">
              <Link
                href={`/blog/${spotlight.slug}`}
                className="block relative h-[340px] md:h-[440px]"
              >
                <Image
                  src={spotlight.image}
                  alt={spotlight.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                      {spotlight.category}
                    </span>
                    <span className="text-xs text-white/90">
                      {formatDate(spotlight.createdAt)}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
                    {spotlight.title}
                  </h2>
                  <p className="mt-2 text-white/85 text-sm">
                    By {spotlight.author}
                  </p>
                </div>
              </Link>
            </section>
          )}

          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Latest from Daily Sparks</h3>
              <Link href="/blogs" className="text-sm text-primary">
                Browse all →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {latest.map((b) => (
                <CardSm key={b._id} b={b} />
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Must Read</h3>
              <Link
                href="/blogs?sort=featured"
                className="text-sm text-primary"
              >
                More →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mustReadMain && (
                <Link
                  href={`/blog/${mustReadMain.slug}`}
                  className="md:col-span-2 group"
                >
                  <div className="relative h-64 md:h-[300px] rounded-2xl overflow-hidden">
                    <Image
                      src={mustReadMain.image}
                      alt={mustReadMain.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 p-6">
                      <span className="px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold">
                        {mustReadMain.category}
                      </span>
                      <h4 className="mt-3 text-2xl font-bold text-white leading-tight">
                        {mustReadMain.title}
                      </h4>
                      <p className="mt-1 text-white/85 text-sm">
                        By {mustReadMain.author} •{" "}
                        {formatDate(mustReadMain.createdAt)}
                      </p>
                    </div>
                  </div>
                </Link>
              )}
              <div className="space-y-4">
                {mustReadSide.map((b) => (
                  <Link
                    key={b._id}
                    href={`/blog/${b.slug}`}
                    className="flex gap-3 p-2 rounded-xl hover:bg-muted/40 transition"
                  >
                    <div className="relative w-28 h-20 shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={b.image}
                        alt={b.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                          {b.category}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {formatDate(b.createdAt)}
                        </span>
                      </div>
                      <h5 className="text-sm font-semibold leading-snug line-clamp-2">
                        {b.title}
                      </h5>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">Editor’s Picks</h3>
            {editorsPick && (
              <Link
                href={`/blog/${editorsPick.slug}`}
                className="block rounded-2xl overflow-hidden border border-border"
              >
                <div className="relative h-56 md:h-72">
                  <Image
                    src={editorsPick.image}
                    alt={editorsPick.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 p-6">
                    <span className="px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold">
                      {editorsPick.category}
                    </span>
                    <h4 className="mt-3 text-2xl md:text-3xl font-extrabold text-white leading-tight">
                      {editorsPick.title}
                    </h4>
                    <p className="mt-1 text-white/85 text-sm">
                      By {editorsPick.author} •{" "}
                      {formatDate(editorsPick.createdAt)}
                    </p>
                  </div>
                </div>
              </Link>
            )}
          </section>

          {!!anime.length && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Anime Highlights</h3>
                <Link
                  href="/blogs?category=Anime"
                  className="text-sm text-primary"
                >
                  See Anime →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {anime.map((b) => (
                  <CardSm key={b._id} b={b} />
                ))}
              </div>
            </section>
          )}

          {!!tech.length && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Tech Guides & Reviews</h3>
                <Link
                  href="/blogs?category=Tech"
                  className="text-sm text-primary"
                >
                  See Tech →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {tech.map((b) => (
                  <CardSm key={b._id} b={b} />
                ))}
              </div>
            </section>
          )}

          {!!travel.length && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Travel Stories</h3>
                <Link
                  href="/blogs?category=Travel"
                  className="text-sm text-primary"
                >
                  See Travel →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {travel.map((b) => (
                  <CardSm key={b._id} b={b} />
                ))}
              </div>
            </section>
          )}

          <section>
            <h3 className="text-xl font-bold mb-4">Browse by Category</h3>
            <div className="flex flex-wrap gap-3">
              {categoriesAll.slice(0, 12).map((cat) => (
                <Link
                  key={cat}
                  href={`/blogs?category=${encodeURIComponent(cat)}`}
                  className="rounded-full border border-border bg-muted/40 px-4 py-2 text-sm hover:bg-muted"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold">
              Get the Daily Sparks newsletter
            </h3>
            <p className="text-muted-foreground mt-1">
              One email. Hand-picked Anime, Tech, and Travel posts.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3 max-w-lg">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={subscribe}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-60"
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </button>
            </div>
          </section>
        </div>

        <footer className="mt-10 border-t border-border py-10 text-center text-sm text-muted-foreground">
          <div className="flex justify-center gap-6 flex-wrap">
            <Link href="/category/Anime" className="hover:text-foreground">
              Anime
            </Link>
            <Link href="/category/Tech" className="hover:text-foreground">
              Tech
            </Link>
            <Link href="/category/Travel" className="hover:text-foreground">
              Travel
            </Link>
          </div>
          <p className="mt-4">© {new Date().getFullYear()} Daily Sparks</p>
        </footer>
      </div>
    </div>
  );
}
