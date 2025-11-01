// app/about/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Daily Sparks",
  description:
    "Rushabh Bhosale’s anime-only blog: reviews, lists, deep dives, and commentary for fans by a fan.",
  alternates: { canonical: "https://dailysparks.in/about" },
  openGraph: {
    type: "website",
    url: "https://dailysparks.in/about",
    title: "About — Daily Sparks",
    description:
      "All anime, all the time — Daily Sparks is where Rushabh Bhosale breaks down characters, arcs, and seasonal gems.",
    siteName: "Daily Sparks",
  },
  twitter: {
    card: "summary_large_image",
    title: "About — Daily Sparks",
    description:
      "All anime, all the time — Daily Sparks is where Rushabh Bhosale breaks down characters, arcs, and seasonal gems.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Daily Sparks",
  url: "https://dailysparks.in",
  author: {
    "@type": "Person",
    name: "Rushabh Bhosale",
  },
  about: [
    "Anime reviews",
    "Character analysis",
    "Watchlists",
    "Seasonal picks",
    "Anime recommendations",
  ],
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <section className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to Daily Sparks — Anime Only.
        </h1>
        <p className="mt-4 text-lg leading-7 text-muted-foreground">
          I’m{" "}
          <a
            className="font-medium underline"
            href="https://rushabh.in"
            target="_blank"
          >
            Rushabh Bhosale
          </a>
          , an anime nerd who’s watched 250+ shows (and counting). Daily Sparks
          is my personal blog where I post reviews, rants, lists, and commentary
          — all focused on anime.
        </p>
        <p className="mt-2 text-lg text-muted-foreground">
          Just one guy writing about what he watches — from shounen icons like{" "}
          <em>Naruto</em> and <em>Bleach</em> to hidden gems like{" "}
          <em>Idaten Jump</em> and <em>Sakura-sou</em>.
        </p>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border bg-background p-6">
          <h2 className="text-xl font-semibold">Anime Reviews</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Honest, no-filter takes on series I’ve finished or dropped —
            including old-school, seasonal, and ongoing titles.
          </p>
        </div>
        <div className="rounded-2xl border bg-background p-6">
          <h2 className="text-xl font-semibold">Watchlists & Rankings</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            What to watch next? I’ve got recommendation lists, top 10s,
            genre-specific picks, and mood-based suggestions.
          </p>
        </div>
        <div className="rounded-2xl border bg-background p-6">
          <h2 className="text-xl font-semibold">Character Breakdowns</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Deep dives into arcs, motivations, symbolism, and growth of iconic
            (and underrated) anime characters.
          </p>
        </div>
        <div className="rounded-2xl border bg-background p-6">
          <h2 className="text-xl font-semibold">No Spoiler? No Problem</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Each post is tagged clearly — spoiler-safe, spoiler-heavy, or first
            impressions. So you won’t ruin the ride.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Anime I Love</h2>
        <ul className="mt-4 flex flex-col gap-2 text-muted-foreground text-sm sm:text-base">
          <li>
            <strong>Hunter x Hunter (2011)</strong> — peak character arcs & Nen
            brilliance
          </li>
          <li>
            <strong>Kage no Jitsuryokusha ni Naritakute!</strong> — absurdity
            done right
          </li>
          <li>
            <strong>Idaten Jump</strong> — nostalgic mountain bike madness
          </li>
          <li>
            <strong>Sakura-sou no Pet na Kanojo</strong> — dreams, chaos & heart
          </li>
          <li>
            <strong>One Piece</strong> — the world-building GOAT
          </li>
          <li>
            <strong>Horimiya</strong> — wholesome high school feels
          </li>
          <li>
            <strong>Danshi Koukousei no Nichijou</strong> — peak deadpan comedy
          </li>
          <li>
            <strong>Death Note</strong> — the original mind game masterclass
          </li>
          <li>
            <strong>Naruto</strong> — the one that started it all
          </li>
          <li>
            <strong>Bleach</strong> — stylish, fast, unforgettable
          </li>
        </ul>
      </section>

      <section className="mt-10 rounded-2xl border bg-background p-6">
        <h2 className="text-xl font-semibold">Want to connect?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Got a show suggestion? Want to collaborate? Drop me a message — I read
          all my emails myself.
        </p>
        <div className="mt-4 flex gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center rounded-xl border px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            Contact Me
          </Link>
          <Link
            href="/"
            className="inline-flex items-center rounded-xl border px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            Read the Blog
          </Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
