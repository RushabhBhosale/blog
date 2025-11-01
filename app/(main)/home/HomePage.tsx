"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type BlogInterface = {
  _id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  author: string;
  createdAt: string;
  image: string;
  imageAlt?: string;
  metaDescription?: string;
};

type Props = { allblogs: BlogInterface[] };

export default function AnimeHomePage({ allblogs }: Props) {
  const blogs = (allblogs || []).filter(
    (b) => b.category?.toLowerCase() === "anime"
  );

  const fmt = (d?: string) =>
    d
      ? new Date(d).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const subscribe = async () => {
    const v = email.trim();
    if (!/.+@.+\..+/.test(v)) {
      alert("Please enter a valid email");
      return;
    }
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Subscribed to Daily Sparks!");
      setEmail("");
    } catch (e) {
      alert("Failed to subscribe");
    } finally {
      setLoading(false);
    }
  };

  const hero = blogs[0];
  const topPicks = blogs.slice(1, 4);
  const mainFeatured = blogs[4];
  const gridPosts = blogs.slice(5, 11);
  const recommendations = blogs.slice(11, 15);
  const allOther = blogs.slice(15);

  const blogUrl = (b: BlogInterface) => `/blog/${b.slug}`;
  console.log("sdhcv", hero);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        {hero && (
          <section className="py-12">
            <Link href={blogUrl(hero)} className="block group">
              <div className="relative rounded-2xl overflow-hidden">
                <div className="relative aspect-[21/9] md:aspect-[21/8]">
                  <Image
                    src={hero.image}
                    alt={hero.title}
                    fill
                    priority
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 max-w-4xl">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold mb-4">
                    FEATURED
                  </span>
                  <h1 className="text-3xl md:text-5xl lg:text-5xl line-clamp-2 font-bold leading-tight mb-4 text-white">
                    {hero.title}
                  </h1>
                  <p className="text-lg text-white/90 mb-6 max-w-3xl">
                    {hero.metaDescription}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-white/80">
                    <span>By {hero.author}</span>
                    <span>•</span>
                    <span>{fmt(hero.createdAt)}</span>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Top Picks */}
        {topPicks.length > 0 && (
          <section className="py-12 border-t border-border">
            <h2 className="text-2xl font-bold mb-8">Editor's Top Picks</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {topPicks.map((post) => (
                <Link
                  key={post._id}
                  href={blogUrl(post)}
                  className="group space-y-4"
                >
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width: 768px) 33vw, 100vw"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{fmt(post.createdAt)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Main Content Grid */}
        <section className="py-12 border-t border-border">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Featured */}
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  Latest Reviews & Analysis
                </h2>
                <Link
                  href="/blogs"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View All
                </Link>
              </div>

              {mainFeatured && (
                <Link href={blogUrl(mainFeatured)} className="group block mb-8">
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-4">
                    <Image
                      src={mainFeatured.image}
                      alt={mainFeatured.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width: 1024px) 66vw, 100vw"
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {mainFeatured.title}
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    An in-depth look at the storytelling, animation quality, and
                    character development that defines this anime experience.
                  </p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{mainFeatured.author}</span>
                    <span>•</span>
                    <span>{fmt(mainFeatured.createdAt)}</span>
                  </div>
                </Link>
              )}

              {gridPosts.length > 0 && (
                <div className="grid sm:grid-cols-2 gap-6">
                  {gridPosts.map((post) => (
                    <Link key={post._id} href={blogUrl(post)} className="group">
                      <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-3">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        />
                      </div>
                      <h4 className="font-bold leading-tight mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{post.author}</span>
                        <span>•</span>
                        <span>{fmt(post.createdAt)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Newsletter */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-bold text-lg mb-2">Weekly Newsletter</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get the best anime content delivered to your inbox every week.
                </p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={subscribe}
                  disabled={loading}
                  className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                >
                  {loading ? "Subscribing..." : "Subscribe"}
                </button>
              </div>

              {/* Recommended */}
              {recommendations.length > 0 && (
                <div>
                  <h3 className="font-bold text-lg mb-4">
                    Recommended Reading
                  </h3>
                  <div className="space-y-4">
                    {recommendations.map((post, idx) => (
                      <Link
                        key={post._id}
                        href={blogUrl(post)}
                        className="group flex gap-3"
                      >
                        <div className="shrink-0 text-2xl font-bold text-muted-foreground/30">
                          {String(idx + 1).padStart(2, "0")}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-sm leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {post.author} • {fmt(post.createdAt)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* About */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-bold text-lg mb-2">About Daily Sparks</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your trusted source for honest anime reviews, seasonal guides,
                  and deep-dive analysis. We watch, review, and recommend so you
                  don't waste time on mediocre shows.
                </p>
                <Link
                  href="/about"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Learn More →
                </Link>
              </div>

              {/* Additional Content */}
              {allOther.length > 0 && (
                <div>
                  <h3 className="font-bold text-lg mb-4">Quick Reads</h3>
                  <div className="space-y-4">
                    {allOther.slice(0, 4).map((post) => (
                      <Link
                        key={post._id}
                        href={blogUrl(post)}
                        className="group block"
                      >
                        <div className="flex gap-3">
                          <div className="relative size-22 shrink-0 rounded-lg overflow-hidden">
                            <Image
                              src={post.image}
                              alt={post.title}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-semibold text-sm leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
                              {post.title}
                            </h4>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {post.metaDescription}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {fmt(post.createdAt)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* More Articles */}
        {allOther.length > 0 && (
          <section className="py-12 border-t border-border">
            <h2 className="text-2xl font-bold mb-8">More From Our Archive</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {allOther.slice(0, 8).map((post) => (
                <Link key={post._id} href={blogUrl(post)} className="group">
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-3">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                  <h4 className="font-semibold text-sm leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {fmt(post.createdAt)}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Footer CTA */}
        <section className="py-16 border-t border-border text-center">
          <h2 className="text-3xl font-bold mb-4">
            Stay Connected with Daily Sparks
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Never miss our latest anime reviews, guides, and analysis. Join our
            growing community of anime enthusiasts and get fresh content
            delivered weekly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#newsletter"
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold"
            >
              Subscribe to Newsletter
            </Link>
            <Link
              href="/about"
              className="px-6 py-3 rounded-lg border border-border font-semibold hover:bg-muted/50 transition"
            >
              About Us
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
