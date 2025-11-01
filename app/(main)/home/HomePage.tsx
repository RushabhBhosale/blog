"use client";
import { useState, useEffect } from "react";
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

type AnimeSummary = {
  malId: number;
  title: string;
  image: string;
  url: string;
  score: number | null;
};

const FALLBACK_TRENDING: AnimeSummary[] = [
  {
    malId: 1,
    title: "My Hero Academia",
    image: "https://cdn.myanimelist.net/images/anime/10/78745.jpg",
    url: "https://myanimelist.net/anime/31964/Boku_no_Hero_Academia",
    score: 8.0,
  },
  {
    malId: 2,
    title: "Jujutsu Kaisen",
    image: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg",
    url: "https://myanimelist.net/anime/40748/Jujutsu_Kaisen",
    score: 8.56,
  },
  {
    malId: 3,
    title: "Demon Slayer",
    image: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg",
    url: "https://myanimelist.net/anime/38000/Kimetsu_no_Yaiba",
    score: 8.5,
  },
  {
    malId: 4,
    title: "Solo Leveling",
    image: "https://cdn.myanimelist.net/images/anime/1983/146190.jpg",
    url: "https://myanimelist.net/anime/52211/Ore_dake_Level_Up_na_Ken",
    score: 8.16,
  },
  {
    malId: 5,
    title: "Frieren: Beyond Journey's End",
    image: "https://cdn.myanimelist.net/images/anime/1015/138006.jpg",
    url: "https://myanimelist.net/anime/52991/Sousou_no_Frieren",
    score: 9.11,
  },
];

const FALLBACK_ALL_TIME: AnimeSummary[] = [
  {
    malId: 6,
    title: "Fullmetal Alchemist: Brotherhood",
    image: "https://cdn.myanimelist.net/images/anime/1208/94745.jpg",
    url: "https://myanimelist.net/anime/5114/Fullmetal_Alchemist__Brotherhood",
    score: 9.24,
  },
  {
    malId: 7,
    title: "Gintama°",
    image: "https://cdn.myanimelist.net/images/anime/3/72078.jpg",
    url: "https://myanimelist.net/anime/28977/Gintama°",
    score: 9.09,
  },
  {
    malId: 8,
    title: "Kaguya-sama: Love is War - Ultra Romantic",
    image: "https://cdn.myanimelist.net/images/anime/1295/106551.jpg",
    url: "https://myanimelist.net/anime/43608/Kaguya-sama_wa_Kokurasetai__Ultra_Romantic",
    score: 9.08,
  },
  {
    malId: 9,
    title: "Attack on Titan Final Season Part 2",
    image: "https://cdn.myanimelist.net/images/anime/10/47347.jpg",
    url: "https://myanimelist.net/anime/48583/Shingeki_no_Kyojin__The_Final_Season_Part_2",
    score: 9.02,
  },
  {
    malId: 10,
    title: "Steins;Gate",
    image: "https://cdn.myanimelist.net/images/anime/1935/127974.jpg",
    url: "https://myanimelist.net/anime/9253/Steins_Gate",
    score: 9.07,
  },
];

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
  const [animeLoading, setAnimeLoading] = useState(true);
  const [animeError, setAnimeError] = useState<string | null>(null);
  const [trendingAnime, setTrendingAnime] = useState<AnimeSummary[]>([]);
  const [topAllTimeAnime, setTopAllTimeAnime] = useState<AnimeSummary[]>([]);

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

  useEffect(() => {
    let isCancelled = false;
    const CACHE_KEY = "anime-charts-cache-v1";
    const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

    const mapAnime = (items: any[]): AnimeSummary[] =>
      items.slice(0, 10).map((entry: any) => ({
        malId: entry.mal_id,
        title: entry.title,
        image:
          entry?.images?.webp?.image_url ??
          entry?.images?.jpg?.large_image_url ??
          entry?.images?.jpg?.image_url ??
          "",
        url: entry.url,
        score:
          typeof entry.score === "number"
            ? Number(entry.score.toFixed(2))
            : null,
      }));

    const applyCache = (cache: any) => {
      const cachedTrending: AnimeSummary[] = cache.trending || [];
      const cachedTop: AnimeSummary[] = cache.top || [];
      if (cachedTrending.length && cachedTop.length) {
        setTrendingAnime(cachedTrending);
        setTopAllTimeAnime(cachedTop);
        setAnimeError(null);
        setAnimeLoading(false);
        return true;
      }
      return false;
    };

    const fetchAnimeCharts = async (skipCache = false) => {
      if (!skipCache) {
        try {
          const cachedRaw =
            typeof window !== "undefined"
              ? sessionStorage.getItem(CACHE_KEY)
              : null;
          if (cachedRaw) {
            const cached = JSON.parse(cachedRaw);
            if (Date.now() - Number(cached.timestamp) < CACHE_TTL) {
              const hit = applyCache(cached);
              if (hit) return;
            }
          }
        } catch {
          /* ignore cache parse errors */
        }
      }

      setAnimeLoading(true);
      setAnimeError(null);
      try {
        const [trendingRes, topRes] = await Promise.all([
          fetch("https://api.jikan.moe/v4/top/anime?filter=airing&limit=5"),
          fetch("https://api.jikan.moe/v4/top/anime?limit=5"),
        ]);

        if (!trendingRes.ok || !topRes.ok) {
          throw new Error("Failed to load anime rankings");
        }

        const trendingJson = await trendingRes.json();
        const topJson = await topRes.json();

        if (isCancelled) return;

        const trendingData = mapAnime(trendingJson?.data || []);
        const topData = mapAnime(topJson?.data || []);
        setTrendingAnime(
          trendingData.length ? trendingData : FALLBACK_TRENDING
        );
        setTopAllTimeAnime(topData.length ? topData : FALLBACK_ALL_TIME);

        if (typeof window !== "undefined") {
          sessionStorage.setItem(
            CACHE_KEY,
            JSON.stringify({
              timestamp: Date.now(),
              trending: trendingData,
              top: topData,
            })
          );
        }
      } catch (err: any) {
        if (!isCancelled) {
          setTrendingAnime(FALLBACK_TRENDING);
          setTopAllTimeAnime(FALLBACK_ALL_TIME);
          setAnimeError(null);
        }
      } finally {
        if (!isCancelled) {
          setAnimeLoading(false);
        }
      }
    };

    fetchAnimeCharts();

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderAnimeList = (title: string, items: AnimeSummary[]) => (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-lg">{title}</h3>
        {animeLoading ? (
          <span className="text-xs text-muted-foreground">Refreshing…</span>
        ) : null}
      </div>
      <ul className="space-y-3">
        {items.map((anime, index) => (
          <li key={anime.malId} className="flex gap-3">
            <span className="text-sm font-semibold text-muted-foreground/70 w-6 text-right">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="flex gap-3 min-w-0">
              {anime.image ? (
                <div className="h-14 w-10 overflow-hidden rounded-md bg-muted/40 shrink-0">
                  <img
                    src={anime.image}
                    alt={anime.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : null}
              <div className="min-w-0">
                <a
                  href={anime.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm font-semibold leading-tight hover:text-primary transition-colors line-clamp-2"
                >
                  {anime.title}
                </a>
                {typeof anime.score === "number" ? (
                  <p className="text-xs text-muted-foreground">
                    Score: {anime.score}
                  </p>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  const hero = blogs[0];
  const topPicks = blogs.slice(1, 4);
  const mainFeatured = blogs[4];
  const gridPosts = blogs.slice(5, 11);
  const recommendations = blogs.slice(11, 15);
  const allOther = blogs.slice(15);

  const blogUrl = (b: BlogInterface) => `/blog/${b.slug}`;
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {hero && (
          <section className="py-8 md:py-12">
            <Link href={blogUrl(hero)} className="block group">
              <div className="relative rounded-2xl overflow-hidden">
                <div className="relative aspect-[4/5] sm:aspect-[16/9] md:aspect-[21/8]">
                  <Image
                    src={hero.image}
                    alt={hero.title}
                    fill
                    priority
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 100vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 md:p-12 max-w-3xl md:max-w-4xl">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[10px] sm:text-xs font-semibold mb-3">
                    FEATURED
                  </span>
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl line-clamp-3 sm:line-clamp-2 font-bold leading-tight mb-3 text-white">
                    {hero.title}
                  </h1>
                  <p className="hidden sm:block text-base md:text-lg text-white/90 mb-4 max-w-3xl line-clamp-3">
                    {hero.metaDescription}
                  </p>
                  <p className="sm:hidden text-sm text-white/85 mb-4 line-clamp-2">
                    {hero.metaDescription}
                  </p>
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-white/80">
                    <span>By {hero.author}</span>
                    <span>•</span>
                    <span>{fmt(hero.createdAt)}</span>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {topPicks.length > 0 && (
          <section className="py-8 md:py-12 border-t border-border">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-8">
              Editor&apos;s Top Picks
            </h2>

            {/* Mobile: horizontal scroll; Desktop: 3-column grid */}
            <div className="sm:hidden -mx-4 px-4">
              <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none">
                {topPicks.map((post) => (
                  <Link
                    key={post._id}
                    href={blogUrl(post)}
                    className="group space-y-3 min-w-[78%] snap-start"
                  >
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="90vw"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-base leading-tight mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{post.author}</span>
                        <span>•</span>
                        <span>{fmt(post.createdAt)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="hidden sm:grid md:grid-cols-3 gap-6">
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
                      sizes="(min-width: 768px) 33vw, 50vw"
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

        <section className="py-8 md:py-12 border-t border-border">
          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold">
                  Latest Reviews & Analysis
                </h2>
                <Link
                  href="/blogs"
                  className="text-xs sm:text-sm font-medium text-primary hover:underline"
                >
                  View All
                </Link>
              </div>

              {mainFeatured && (
                <Link href={blogUrl(mainFeatured)} className="group block">
                  <div className="relative aspect-[4/3] sm:aspect-[16/9] rounded-xl overflow-hidden mb-3 sm:mb-4">
                    <Image
                      src={mainFeatured.image}
                      alt={mainFeatured.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width: 1024px) 66vw, 100vw"
                    />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {mainFeatured.title}
                  </h3>
                  <p className="hidden sm:block text-muted-foreground mb-3">
                    An in-depth look at the storytelling, animation quality, and
                    character development that defines this anime experience.
                  </p>
                  <p className="sm:hidden text-sm text-muted-foreground mb-3 line-clamp-2">
                    In-depth look at storytelling, animation, and character
                    work.
                  </p>
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                    <span>{mainFeatured.author}</span>
                    <span>•</span>
                    <span>{fmt(mainFeatured.createdAt)}</span>
                  </div>
                </Link>
              )}

              {gridPosts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {gridPosts.map((post) => (
                    <Link key={post._id} href={blogUrl(post)} className="group">
                      <div className="relative aspect-[16/11] rounded-lg overflow-hidden mb-2 sm:mb-3">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        />
                      </div>
                      <h4 className="font-bold text-base sm:text-lg leading-tight mb-1 sm:mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] sm:text-xs text-muted-foreground">
                        <span>{post.author}</span>
                        <span>•</span>
                        <span>{fmt(post.createdAt)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6 md:space-y-8 lg:sticky lg:top-6 lg:self-start">
              <div
                id="newsletter"
                className="rounded-xl border border-border bg-card p-4 sm:p-6"
              >
                <h3 className="font-bold text-base sm:text-lg mb-2">
                  Weekly Newsletter
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                  Get the best anime content delivered to your inbox every week.
                </p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={subscribe}
                  disabled={loading}
                  className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                >
                  {loading ? "Subscribing..." : "Subscribe"}
                </button>
              </div>

              <div className="hidden md:block">
                {renderAnimeList("Top 5 Trending Anime", trendingAnime)}
                {renderAnimeList("Top 5 Anime of All Time", topAllTimeAnime)}
              </div>

              {recommendations.length > 0 && (
                <div>
                  <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">
                    Recommended Reading
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    {recommendations.map((post, idx) => (
                      <Link
                        key={post._id}
                        href={blogUrl(post)}
                        className="group flex gap-3"
                      >
                        <div className="shrink-0 text-lg sm:text-2xl font-bold text-muted-foreground/30">
                          {String(idx + 1).padStart(2, "0")}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-sm leading-tight mb-0.5 sm:mb-1 group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h4>
                          <p className="text-[11px] sm:text-xs text-muted-foreground">
                            {post.author} • {fmt(post.createdAt)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
                <h3 className="font-bold text-base sm:text-lg mb-2">
                  About Daily Sparks
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                  Honest anime reviews, seasonal guides, and deep dives. We
                  watch, review, and recommend so you don&apos;t waste time on
                  mediocre shows.
                </p>
                <Link
                  href="/about"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Learn More →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {allOther.length > 0 && (
          <section className="py-8 md:py-12 border-t border-border">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-8">
              More From Our Archive
            </h2>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {allOther.slice(0, 8).map((post) => (
                <Link key={post._id} href={blogUrl(post)} className="group">
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-2 sm:mb-3">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                  <h4 className="font-semibold text-sm leading-tight mb-1 sm:mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-muted-foreground">
                    {fmt(post.createdAt)}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="py-12 md:py-16 border-t border-border text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
            Stay Connected with Daily Sparks
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
            Never miss our latest anime reviews, guides, and analysis. Join our
            growing community and get fresh content delivered weekly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="#newsletter"
              className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm sm:text-base"
            >
              Subscribe to Newsletter
            </Link>
            <Link
              href="/about"
              className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg border border-border font-semibold text-sm sm:text-base hover:bg-muted/50 transition"
            >
              About Us
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
