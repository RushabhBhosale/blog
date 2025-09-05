// app/about/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Daily Sparks",
  description:
    "Daily Sparks by Rushabh Bhosale: thoughtful takes on TV series, anime, travel guides, and practical tech reviews.",
  alternates: { canonical: "https://dailysparks.in/about" },
  openGraph: {
    type: "website",
    url: "https://dailysparks.in/about",
    title: "About — Daily Sparks",
    description:
      "Stories, guides, and reviews across TV, anime, travel, and tech by Rushabh Bhosale.",
    siteName: "Daily Sparks",
  },
  twitter: {
    card: "summary_large_image",
    title: "About — Daily Sparks",
    description:
      "Stories, guides, and reviews across TV, anime, travel, and tech by Rushabh Bhosale.",
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
    "TV series reviews",
    "Anime breakdowns",
    "Travel guides",
    "Tech and gadgets",
  ],
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <section className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          About Daily Sparks
        </h1>
        <p className="mt-4 text-lg leading-7 text-muted-foreground">
          I’m <span className="font-medium">Rushabh Bhosale</span> — a software
          developer who writes about the things I use and love: TV series,
          anime, travel, and practical tech. Daily Sparks is where I publish
          clear, useful posts that help you decide what to watch, where to go,
          and what to buy.
        </p>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border bg-background p-6">
          <h2 className="text-xl font-semibold">TV & Anime</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Reviews, watch guides, and deeper dives into characters, arcs, and
            seasonal picks.
          </p>
        </div>
        <div className="rounded-2xl border bg-background p-6">
          <h2 className="text-xl font-semibold">Travel</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            City playbooks, hidden spots, budgets, and checklists that make
            trips simpler.
          </p>
        </div>
        <div className="rounded-2xl border bg-background p-6">
          <h2 className="text-xl font-semibold">Tech</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Hands-on takes on gadgets, apps, and workflows with actionable
            recommendations.
          </p>
        </div>
        <div className="rounded-2xl border bg-background p-6">
          <h2 className="text-xl font-semibold">Why Read</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            No fluff. Just concise, bias-checked posts you can trust and use
            immediately.
          </p>
        </div>
      </section>

      <section className="mt-10 rounded-2xl border bg-background p-6">
        <h2 className="text-xl font-semibold">Work with me</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Open to collaborations, sponsorships, and product reviews that fit the
          site’s audience.
        </p>
        <div className="mt-4 flex gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center rounded-xl border px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            Contact
          </Link>
          <Link
            href="/"
            className="inline-flex items-center rounded-xl border px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            Read the blog
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
