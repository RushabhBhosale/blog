import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  travelStories,
  type TravelStory,
  type TravelStoryLayout,
} from "@/lib/travelStories";
import PhotoGallery from "@/components/PhotoGallery";
import ItineraryOverview from "@/components/ItineraryOverview";

const themeStyles: Record<
  TravelStoryLayout,
  {
    badge: string;
    border: string;
    accent: string;
    timeline: string;
    dot: string;
    muted: string;
  }
> = {
  coastal: {
    badge: "bg-sky-100 text-sky-700",
    border: "border-sky-200",
    accent: "text-sky-800",
    timeline: "border-sky-200",
    dot: "bg-sky-400",
    muted: "text-slate-600",
  },
  zen: {
    badge: "bg-emerald-100 text-emerald-700",
    border: "border-emerald-200",
    accent: "text-emerald-700",
    timeline: "border-emerald-200",
    dot: "bg-emerald-400",
    muted: "text-emerald-700/80",
  },
  expedition: {
    badge: "bg-amber-100 text-amber-700",
    border: "border-amber-200",
    accent: "text-amber-700",
    timeline: "border-amber-200",
    dot: "bg-amber-500",
    muted: "text-slate-600",
  },
};

type Params = any;

export function generateStaticParams(): Params[] {
  return travelStories.map((story) => ({ slug: story.slug }));
}

export function generateMetadata({ params }: any): Metadata {
  const story = travelStories.find((item) => item.slug === params.slug);
  if (!story) {
    return { title: "Travel Story" };
  }

  return {
    title: `${story.title} – ${story.location}`,
    description: story.intro,
    openGraph: {
      title: `${story.title} | Travel Stories`,
      description: story.intro,
      images: [{ url: story.coverImage, alt: story.coverImageAlt }],
    },
  };
}

function HighlightCards({ story }: { story: TravelStory }) {
  const theme = themeStyles[story.theme.layout];
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {story.highlights.map((highlight) => (
        <article
          key={highlight.title}
          className={`rounded-2xl border bg-card p-5 shadow-sm ${theme.border}`}
        >
          <p className={`text-xs font-semibold uppercase ${theme.accent}`}>
            {highlight.title}
          </p>
          <p className={`mt-2 text-sm leading-relaxed ${theme.muted}`}>
            {highlight.description}
          </p>
          {highlight.accent && (
            <p className="mt-3 text-xs font-medium text-muted-foreground">
              {highlight.accent}
            </p>
          )}
        </article>
      ))}
    </div>
  );
}

function SignatureMoments({ story }: { story: TravelStory }) {
  const theme = themeStyles[story.theme.layout];
  return (
    <div className="space-y-6">
      {story.signatureMoments.map((moment) => (
        <article
          key={moment.heading}
          className={`overflow-hidden rounded-2xl border bg-card shadow-sm ${theme.border}`}
        >
          {moment.image && (
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={moment.image}
                alt={moment.heading}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 600px, 92vw"
              />
            </div>
          )}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-foreground">
              {moment.heading}
            </h3>
            <p className={`mt-3 text-sm leading-relaxed ${theme.muted}`}>
              {moment.description}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}

function TravelStoryDetail({ story }: { story: TravelStory }) {
  const theme = themeStyles[story.theme.layout];

  return (
    <main className="bg-background">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <Link
          href="/travel"
          className="text-sm text-muted-foreground transition hover:text-foreground"
        >
          ← Back to travel stories
        </Link>

        <section className="mt-6 space-y-6">
          <div className="relative overflow-hidden rounded-3xl">
            <Image
              src={story.coverImage}
              alt={story.coverImageAlt}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 960px, 95vw"
              priority
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <span className={`rounded-full px-3 py-1 ${theme.badge}`}>
              {story.location}
            </span>
            <span className={`rounded-full px-3 py-1 ${theme.badge}`}>
              {story.dateRange}
            </span>
          </div>

          <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
            {story.title}
          </h1>
          <p className={`text-base leading-relaxed ${theme.muted}`}>
            {story.intro}
          </p>

          <dl className="mt-4 grid gap-4 sm:grid-cols-3">
            {story.quickFacts.map((fact) => (
              <div
                key={fact.label}
                className={`rounded-xl border bg-card p-4 text-left text-sm shadow-sm ${theme.border}`}
              >
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {fact.label}
                </dt>
                <dd className="mt-1 text-sm text-foreground">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-12 space-y-4">
          <header>
            <h2 className="text-2xl font-semibold text-foreground">
              Trip highlights
            </h2>
            <p className="text-sm text-muted-foreground">
              A few stand-out experiences from the journey.
            </p>
          </header>
          <HighlightCards story={story} />
        </section>

        <section className="mt-12 space-y-4">
          <header>
            <h2 className="text-2xl font-semibold text-foreground">
              Itinerary overview
            </h2>
            <p className="text-sm text-muted-foreground">
              Quick look at the day-by-day plan.
            </p>
          </header>
          <ItineraryOverview
            itinerary={story.itinerary}
            theme={{
              border: theme.border,
              accent: theme.accent,
              muted: theme.muted,
            }}
          />
        </section>

        <section className="mt-12 space-y-4">
          <header>
            <h2 className="text-2xl font-semibold text-foreground">
              Signature moments
            </h2>
            <p className="text-sm text-muted-foreground">
              The stories I still share when people ask about this trip.
            </p>
          </header>
          <SignatureMoments story={story} />
        </section>

        <PhotoGallery story={story} />
      </div>
    </main>
  );
}

export default function Page({ params }: { params: Params }) {
  const story = travelStories.find((item) => item.slug === params.slug);
  if (!story) {
    notFound();
  }
  return <TravelStoryDetail story={story} />;
}
