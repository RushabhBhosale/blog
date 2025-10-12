import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  travelStories,
  type TravelStory,
  type TravelStoryLayout,
} from "@/lib/travelStories";

const detailTokens: Record<
  TravelStoryLayout,
  {
    pageBackground: string;
    subtitle: string;
    highlightCard: string;
    highlightAccent: string;
    timelineTrack: string;
    timelineDot: string;
    timelineCard: string;
    quoteBackdrop: string;
    momentCard: string;
    momentShadow: string;
    galleryBackdrop: string;
    galleryRing: string;
    muted: string;
  }
> = {
  coastal: {
    pageBackground:
      "bg-gradient-to-b from-sky-50 via-white to-blue-50 text-slate-900",
    subtitle: "text-slate-600",
    highlightCard: "bg-white/80 border border-sky-100/70",
    highlightAccent: "text-sky-600",
    timelineTrack: "bg-sky-200/80",
    timelineDot: "bg-white border-4 border-sky-200/80",
    timelineCard: "bg-white/90 shadow-lg shadow-sky-200/50",
    quoteBackdrop: "bg-white/80 border border-sky-100/60",
    momentCard: "bg-white/90",
    momentShadow: "shadow-lg shadow-sky-200/40",
    galleryBackdrop: "bg-white/80 border border-sky-100/50",
    galleryRing: "ring-4 ring-sky-100/60",
    muted: "text-slate-600",
  },
  zen: {
    pageBackground:
      "bg-gradient-to-b from-emerald-50 via-white to-lime-50 text-slate-900",
    subtitle: "text-emerald-700/70",
    highlightCard: "bg-white/70 border border-emerald-100/80",
    highlightAccent: "text-emerald-600",
    timelineTrack: "bg-emerald-200/70",
    timelineDot: "bg-white border-4 border-emerald-200/70",
    timelineCard: "bg-emerald-50/80 shadow-lg shadow-emerald-100/50",
    quoteBackdrop: "bg-white/70 border border-emerald-100/70",
    momentCard: "bg-white/80",
    momentShadow: "shadow-lg shadow-emerald-100/40",
    galleryBackdrop: "bg-white/70 border border-emerald-100/60",
    galleryRing: "ring-4 ring-emerald-100/60",
    muted: "text-emerald-700/70",
  },
  expedition: {
    pageBackground:
      "bg-gradient-to-b from-slate-900 via-slate-950 to-black text-slate-100",
    subtitle: "text-slate-300",
    highlightCard: "bg-white/10 border border-white/15 backdrop-blur",
    highlightAccent: "text-amber-300",
    timelineTrack: "bg-white/10",
    timelineDot: "bg-slate-950 border-4 border-white/20",
    timelineCard: "bg-white/5 border border-white/10 shadow-xl shadow-black/40",
    quoteBackdrop: "bg-white/5 border border-white/15",
    momentCard: "bg-white/5 border border-white/10",
    momentShadow: "shadow-2xl shadow-black/50",
    galleryBackdrop: "bg-white/5 border border-white/10",
    galleryRing: "ring-4 ring-white/10",
    muted: "text-slate-300",
  },
};

const heroLayouts: Record<
  TravelStoryLayout,
  {
    grid: string;
    imageAspect: string;
    imageStyle: string;
    overlay: string;
  }
> = {
  coastal: {
    grid: "md:grid-cols-[1.05fr_0.95fr]",
    imageAspect: "aspect-[5/4]",
    imageStyle: "object-cover",
    overlay: "bg-gradient-to-t from-sky-500/20 via-transparent to-transparent",
  },
  zen: {
    grid: "md:grid-cols-[0.9fr_1.1fr]",
    imageAspect: "aspect-[3/4] md:aspect-[5/4]",
    imageStyle: "object-cover saturate-110",
    overlay:
      "bg-gradient-to-tr from-emerald-500/15 via-transparent to-transparent",
  },
  expedition: {
    grid: "md:grid-cols-[1fr_1fr]",
    imageAspect: "aspect-[16/10] md:aspect-[5/3]",
    imageStyle: "object-cover brightness-110",
    overlay: "bg-gradient-to-t from-black/40 via-transparent to-transparent",
  },
};

const galleryLayouts: Record<TravelStoryLayout, string[]> = {
  coastal: [
    "col-span-12 md:col-span-7 row-span-2",
    "col-span-6 md:col-span-5",
    "col-span-6 md:col-span-5 row-span-2",
    "col-span-12 md:col-span-7",
  ],
  zen: [
    "col-span-6 md:col-span-4 row-span-2",
    "col-span-6 md:col-span-8",
    "col-span-12 md:col-span-6 row-span-2",
    "col-span-12 md:col-span-6",
  ],
  expedition: [
    "col-span-12 md:col-span-7 row-span-2",
    "col-span-12 md:col-span-5",
    "col-span-12 md:col-span-5 row-span-2",
    "col-span-12 md:col-span-7",
  ],
};

type Params = any;

export function generateStaticParams(): Params[] {
  return travelStories.map((story) => ({ slug: story.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const story = travelStories.find((item) => item.slug === params.slug);
  if (!story) {
    return {
      title: "Travel Story",
    };
  }

  return {
    title: `${story.title} – ${story.location} Travel Story`,
    description: story.intro,
    openGraph: {
      title: `${story.title} | Travel Stories`,
      description: story.intro,
      images: [{ url: story.coverImage, alt: story.coverImageAlt }],
    },
  };
}

function HighlightCard({
  story,
  highlight,
}: {
  story: TravelStory;
  highlight: TravelStory["highlights"][number];
}) {
  const variant = detailTokens[story.theme.layout];
  return (
    <div
      className={`${variant.highlightCard} rounded-2xl p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg`}
    >
      <p className="text-sm font-semibold uppercase tracking-wide text-foreground/70">
        {highlight.title}
      </p>
      <p className={`mt-2 text-sm leading-relaxed ${variant.muted}`}>
        {highlight.description}
      </p>
      {highlight.accent && (
        <p className={`mt-3 text-xs font-medium ${variant.highlightAccent}`}>
          {highlight.accent}
        </p>
      )}
    </div>
  );
}

function SignatureMomentCard({
  story,
  moment,
}: {
  story: TravelStory;
  moment: TravelStory["signatureMoments"][number];
}) {
  const variant = detailTokens[story.theme.layout];
  const hasImage = Boolean(moment.image);
  const layout = moment.layout || "left";
  const isReversed = layout === "right";
  const isFull = layout === "full";

  if (isFull) {
    return (
      <div
        className={`${variant.momentCard} ${variant.momentShadow} overflow-hidden rounded-[2.75rem] p-0`}
      >
        {hasImage && (
          <div
            className={`${story.theme.galleryShape} relative h-64 sm:h-80 overflow-hidden`}
          >
            <Image
              src={moment.image!}
              alt={moment.heading}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 75vw, 95vw"
            />
          </div>
        )}
        <div className="px-6 py-8 sm:px-10 sm:py-10">
          <h3 className="text-xl font-semibold text-foreground">
            {moment.heading}
          </h3>
          <p className={`mt-3 text-base leading-relaxed ${variant.muted}`}>
            {moment.description}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${variant.momentCard} ${variant.momentShadow} overflow-hidden rounded-[2.5rem]`}
    >
      <div
        className={`grid gap-0 md:grid-cols-2 ${
          isReversed ? "md:[&>*:first-child]:order-2" : ""
        }`}
      >
        {hasImage && (
          <div className="relative">
            <div
              className={`${story.theme.galleryShape} relative m-6 h-full overflow-hidden`}
            >
              <Image
                src={moment.image!}
                alt={moment.heading}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 40vw, 90vw"
              />
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>
          </div>
        )}
        <div className="px-6 py-8 sm:px-10 sm:py-10">
          <h3 className="text-xl font-semibold text-foreground">
            {moment.heading}
          </h3>
          <p className={`mt-3 text-base leading-relaxed ${variant.muted}`}>
            {moment.description}
          </p>
        </div>
      </div>
    </div>
  );
}

function TravelStoryDetail({ story }: { story: TravelStory }) {
  const variant = detailTokens[story.theme.layout];
  const heroLayout = heroLayouts[story.theme.layout];
  const galleryPattern = galleryLayouts[story.theme.layout];

  return (
    <div className={`${variant.pageBackground}`}>
      <div className="mx-auto flex max-w-6xl flex-col gap-16 -mb-10 px-4 py-12 sm:py-16">
        <section
          className={`${story.theme.heroBackground} relative overflow-hidden rounded-[3.5rem] border ${story.theme.border} px-6 py-14 sm:px-10 sm:py-16`}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.55),_transparent_55%)]" />
          <div
            className={`relative grid items-start gap-10 ${heroLayout.grid}`}
          >
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.4em] text-foreground/60">
                <span>Travel Story</span>
                <span className="h-1 w-1 rounded-full bg-foreground/40" />
                <span>{story.location}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-semibold text-foreground">
                {story.title}
              </h1>
              <p
                className={`max-w-2xl text-base sm:text-lg leading-relaxed ${variant.muted}`}
              >
                {story.intro}
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {story.quickFacts.map((fact) => (
                  <div
                    key={fact.label}
                    className="rounded-2xl border border-white/30 bg-white/40 px-4 py-3 text-sm backdrop-blur"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-foreground/60">
                      {fact.label}
                    </p>
                    <p className="mt-1 text-sm text-foreground/80">
                      {fact.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div
                className={`${story.theme.galleryShape} ${heroLayout.imageAspect} relative overflow-hidden border border-white/20 shadow-xl shadow-black/20`}
              >
                <Image
                  src={story.coverImage}
                  alt={story.coverImageAlt}
                  fill
                  className={heroLayout.imageStyle}
                  sizes="(min-width: 1024px) 35vw, (min-width: 768px) 50vw, 95vw"
                />
                <span
                  className={`pointer-events-none absolute inset-0 ${heroLayout.overlay}`}
                />
              </div>
            </div>
          </div>
          <div
            className={`${variant.quoteBackdrop} relative mt-10 rounded-3xl border px-6 py-5 sm:px-8 sm:py-6`}
          >
            <p className="text-base sm:text-lg italic leading-relaxed text-foreground/80">
              “{story.heroQuote.text}”
            </p>
            <p
              className={`mt-3 text-sm font-medium uppercase tracking-wide ${variant.highlightAccent}`}
            >
              {story.heroQuote.attribution}
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-foreground/60">
              Highlights
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-foreground">
              Signature experiences that defined the trip
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {story.highlights.map((highlight) => (
              <HighlightCard
                key={highlight.title}
                story={story}
                highlight={highlight}
              />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-foreground/60">
              Itinerary
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-foreground">
              Day-by-day flow
            </h2>
          </div>
          <div className="relative pl-6 sm:pl-10">
            <span
              className={`absolute left-3 top-0 h-full w-[2px] sm:left-5 ${variant.timelineTrack}`}
            />
            <div className="space-y-8">
              {story.itinerary.map((day) => (
                <div key={day.dayLabel} className="relative">
                  <span
                    className={`absolute left-[-11px] sm:left-[-7px] top-1 flex h-6 w-6 items-center justify-center rounded-full ${variant.timelineDot}`}
                  />
                  <div
                    className={`${variant.timelineCard} rounded-3xl border px-5 py-5 sm:px-8 sm:py-6`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-foreground/60">
                      {day.dayLabel}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-foreground">
                      {day.title}
                    </h3>
                    <p
                      className={`mt-2 text-sm leading-relaxed ${variant.muted}`}
                    >
                      {day.description}
                    </p>
                    {day.highlights && (
                      <ul className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-foreground/70">
                        {day.highlights.map((item) => (
                          <li
                            key={item}
                            className="rounded-full border border-foreground/10 px-3 py-1"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-foreground/60">
              Signature Moments
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-foreground">
              Little stories worth remembering
            </h2>
          </div>
          <div className="flex flex-col gap-10">
            {story.signatureMoments.map((moment) => (
              <SignatureMomentCard
                key={moment.heading}
                story={story}
                moment={moment}
              />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-foreground/60">
              Gallery
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-foreground">
              Photo diary
            </h2>
          </div>
          <div
            className={`${variant.galleryBackdrop} rounded-[3rem] border px-4 py-6 sm:px-6 sm:py-8`}
          >
            <div className="grid grid-cols-12 gap-3 sm:gap-4 auto-rows-[160px] sm:auto-rows-[220px] md:auto-rows-[260px]">
              {story.gallery.map((image, index) => {
                const spanClass = galleryPattern[index] || "col-span-12";
                return (
                  <div
                    key={image.src}
                    className={`${spanClass} relative overflow-hidden ${story.theme.galleryShape} ${variant.galleryRing}`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 95vw"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function Page({ params }: any) {
  const story = travelStories.find((item) => item.slug === params.slug);
  if (!story) {
    notFound();
  }
  return <TravelStoryDetail story={story} />;
}
