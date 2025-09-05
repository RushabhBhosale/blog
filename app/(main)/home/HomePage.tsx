"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BlogInterface } from "./page";
import axiosClient from "@/lib/axiosclient";
import { toast } from "sonner";

type Props = { allblogs: BlogInterface[] };

export default function HomePage({ allblogs }: Props) {
  const blogs = allblogs || [];

  const fmt = (d?: string) =>
    d
      ? new Date(d).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "";

  const byCat = (name: string) =>
    blogs.filter((b) => b.category?.toLowerCase() === name.toLowerCase());

  const spotlight = blogs[0];
  const latest = blogs.slice(1, 9);
  const mustMain = blogs[9] || blogs[1];
  const mustSide = blogs.slice(10, 13);
  const editors = blogs[13] || blogs[2];

  const anime = byCat("Anime").slice(0, 4);
  const tech = byCat("Tech").slice(0, 4);
  const travel = byCat("Travel").slice(0, 4);

  const categoriesAll = Array.from(
    new Set(blogs.map((b) => b.category))
  ).filter(Boolean) as string[];

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const subscribe = async () => {
    const v = email.trim();
    if (!/.+@.+\..+/.test(v)) return toast.error("Please enter a valid email");
    try {
      setLoading(true);
      await axiosClient.post("/newsletter/subscribe", { email: v });
      toast.success("Subscribed to Daily Sparks.");
      setEmail("");
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Failed to subscribe");
    } finally {
      setLoading(false);
    }
  };

  const SectionHeader = ({
    title,
    href,
    cta = "View All →",
    sub,
  }: {
    title: string;
    href: string;
    cta?: string;
    sub?: string;
  }) => (
    <div className="mb-6 flex items-end justify-between">
      <div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight">
          {title}
        </h2>
        {sub ? (
          <p className="text-sm text-muted-foreground mt-1">{sub}</p>
        ) : null}
      </div>
      <Link href={href} className="text-sm font-medium text-primary">
        {cta}
      </Link>
    </div>
  );

  const CardSm = ({ b }: { b: BlogInterface }) => (
    <Link href={`/blog/${b.slug}`} className="group h-full">
      <article className="h-full overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-sm">
        <div className="relative w-full aspect-[4/3]">
          <Image
            src={b.image}
            alt={b.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(min-width:1024px) 260px, (min-width:640px) 33vw, 100vw"
          />
        </div>
        <div className="p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
              {b.category}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {fmt(b.createdAt)}
            </span>
          </div>
          <h3 className="text-sm font-semibold leading-snug line-clamp-2">
            {b.title}
          </h3>
          <p className="mt-2 text-[12px] text-muted-foreground line-clamp-1">
            By {b.author}
          </p>
        </div>
      </article>
    </Link>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1120px] px-4 sm:px-6 lg:px-8">
        <header className="hidden md:block py-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
            <span className="text-xs font-semibold tracking-wide text-primary">
              DAILY SPARKS
            </span>
            <span className="text-xs text-muted-foreground">
              Anime • Tech • Travel • Media
            </span>
          </div>
          <h1 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight">
            Fresh Ideas, Every Day
          </h1>
          <p className="mt-2 text-muted-foreground">
            Reviews, guides, and stories from our creators.
          </p>
        </header>

        <main className="space-y-14">
          {spotlight && (
            <section>
              <Link href={`/blog/${spotlight.slug}`} className="block">
                <article className="relative overflow-hidden rounded-2xl border border-border bg-card">
                  <div className="relative w-full aspect-[3/2] md:aspect-[16/6]">
                    <Image
                      src={spotlight.image}
                      alt={spotlight.title}
                      fill
                      priority
                      className="object-cover"
                      sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      <span className="px-3 py-1 hidden md:block rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                        {spotlight.category}
                      </span>
                    </div>
                    <h2 className="sm:text-3xl md:text-4xl font-extrabold text-white leading-tight line-clamp-2">
                      {spotlight.title}
                    </h2>
                    <p className="mt-1 text-white/85 text-sm">
                      By {spotlight.author} • {fmt(spotlight.createdAt)}
                    </p>
                  </div>
                </article>
              </Link>
            </section>
          )}

          <section>
            <SectionHeader
              title="Latest from Daily Sparks"
              href="/blogs"
              sub="Fresh drops across Anime, Tech, and Travel"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {latest.map((b) => (
                <CardSm key={b._id} b={b} />
              ))}
            </div>
          </section>

          <section>
            <SectionHeader
              title="Must Read"
              href="/blogs?sort=featured"
              cta="More →"
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              {mustMain && (
                <Link
                  href={`/blog/${mustMain.slug}`}
                  className="lg:col-span-2 group"
                >
                  <article className="relative overflow-hidden rounded-2xl border border-border">
                    <div className="relative w-full aspect-[3/2] md:aspect-[16/8]">
                      <Image
                        src={mustMain.image}
                        alt={mustMain.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        sizes="(min-width:1024px) 720px, 100vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <span className="hidden md:block px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold w-fit">
                        {mustMain.category}
                      </span>
                      <h3 className="mt-3 font-bold text-white leading-tight line-clamp-2">
                        {mustMain.title}
                      </h3>
                      <p className="mt-1 text-white/85 text-sm">
                        By {mustMain.author} • {fmt(mustMain.createdAt)}
                      </p>
                    </div>
                  </article>
                </Link>
              )}
              <div className="space-y-4">
                {mustSide.map((b) => (
                  <Link key={b._id} href={`/blog/${b.slug}`} className="block">
                    <article className="flex gap-3 rounded-xl border border-border bg-card p-3 hover:bg-muted/40 transition">
                      <div className="relative w-32 shrink-0 overflow-hidden rounded-lg">
                        <div className="relative w-full aspect-[10/6.15]">
                          <Image
                            src={b.image}
                            alt={b.title}
                            fill
                            className="object-cover"
                            sizes="160px"
                          />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                            {b.category}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {fmt(b.createdAt)}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold leading-snug line-clamp-2">
                          {b.title}
                        </h4>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {editors && (
            <section className="relative">
              <h3 className="mb-6 text-xl md:text-2xl font-bold">
                Editor’s Pick
              </h3>
              <Link href={`/blog/${editors.slug}`} className="block">
                <article className="overflow-hidden rounded-2xl border border-border">
                  <div className="relative w-full aspect-[3/2] md:aspect-[16/7]">
                    <Image
                      src={editors.image}
                      alt={editors.title}
                      fill
                      className="object-cover"
                      sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <span className="hidden md:block px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold w-fit">
                      {editors.category}
                    </span>
                    <h4 className="mt-3 md:text-3xl font-extrabold text-white leading-tight line-clamp-2">
                      {editors.title}
                    </h4>
                    <p className="mt-1 text-white/85 text-sm">
                      By {editors.author} • {fmt(editors.createdAt)}
                    </p>
                  </div>
                </article>
              </Link>
            </section>
          )}

          {!!anime.length && (
            <section>
              <SectionHeader
                title="Anime Highlights"
                href="/blogs?category=Anime"
                cta="See Anime →"
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {anime.map((b) => (
                  <CardSm key={b._id} b={b} />
                ))}
              </div>
            </section>
          )}

          {!!tech.length && (
            <section>
              <SectionHeader
                title="Tech Guides & Reviews"
                href="/blogs?category=Tech"
                cta="See Tech →"
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {tech.map((b) => (
                  <CardSm key={b._id} b={b} />
                ))}
              </div>
            </section>
          )}

          {!!travel.length && (
            <section>
              <SectionHeader
                title="Travel Stories"
                href="/blogs?category=Travel"
                cta="See Travel →"
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {travel.map((b) => (
                  <CardSm key={b._id} b={b} />
                ))}
              </div>
            </section>
          )}

          <section className="rounded-2xl border border-border bg-card p-8 text-center">
            <h3 className="text-xl md:text-2xl font-bold">
              Get the Daily Sparks Newsletter
            </h3>
            <p className="mt-1 text-muted-foreground">
              Hand-picked Anime, Tech, Cinema and Travel — weekly.
            </p>
            <div className="mx-auto mt-4 flex max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={subscribe}
                disabled={loading}
                className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground disabled:opacity-60"
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
