import Image from "next/image";
import Link from "next/link";
import type { TravelStory, TravelStoryLayout } from "@/lib/travelStories";

const layoutTokens: Record<
  TravelStoryLayout,
  {
    wrapper: string;
    imageWrapper: string;
    imageClass: string;
    accentDot: string;
  }
> = {
  coastal: {
    wrapper:
      "md:grid md:grid-cols-12 gap-8 md:gap-10 p-6 sm:p-10 md:p-12 bg-gradient-to-br from-white via-sky-50 to-blue-100 border border-sky-100/60 rounded-[2.5rem] shadow-lg shadow-sky-200/30",
    imageWrapper:
      "md:col-span-5 lg:col-span-4 relative overflow-hidden rounded-[2rem] ring-4 ring-sky-200/40",
    imageClass: "object-cover",
    accentDot: "bg-sky-300",
  },
  zen: {
    wrapper:
      "md:grid md:grid-cols-12 gap-8 md:gap-12 p-6 sm:p-10 md:p-12 bg-gradient-to-br from-white via-emerald-50 to-lime-100 border border-emerald-100/60 rounded-[3rem] shadow-xl shadow-emerald-100/40",
    imageWrapper:
      "md:col-span-5 lg:col-span-5 relative overflow-hidden rounded-[3rem] ring-4 ring-emerald-200/40 order-last md:order-first",
    imageClass: "object-cover saturate-110",
    accentDot: "bg-emerald-400",
  },
  expedition: {
    wrapper:
      "md:grid md:grid-cols-12 gap-8 md:gap-12 p-6 sm:p-10 md:p-12 bg-gradient-to-br from-slate-950 via-slate-900 to-stone-900 border border-white/10 rounded-[2.75rem] shadow-2xl shadow-black/40 text-slate-100",
    imageWrapper:
      "md:col-span-6 lg:col-span-5 relative overflow-hidden rounded-[2.5rem] ring-4 ring-white/10",
    imageClass: "object-cover brightness-110",
    accentDot: "bg-amber-400",
  },
};

function TravelStoryCard({ story }: { story: TravelStory }) {
  const layout = layoutTokens[story.theme.layout];

  return (
    <article className={layout.wrapper}>
      <div
        className={`${layout.imageWrapper} aspect-[4/3] shadow-lg shadow-black/10`}
      >
        <Image
          src={story.coverImage}
          alt={story.coverImageAlt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 45vw, 90vw"
          className={layout.imageClass}
          priority
        />
        <span
          className={`absolute top-4 left-4 h-3 w-3 rounded-full ${layout.accentDot}`}
        />
      </div>
      <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            My Travel Story
          </p>
          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold">
            {story.title}
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <span
              className={`px-3 py-1 rounded-full ${story.theme.chipBackground} ${story.theme.chipText}`}
            >
              {story.location}
            </span>
            <span
              className={`px-3 py-1 rounded-full ${story.theme.chipBackground} ${story.theme.chipText}`}
            >
              {story.dateRange}
            </span>
          </div>
        </div>
        <p className="text-base leading-relaxed text-muted-foreground max-w-2xl">
          {story.intro}
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {story.highlights.slice(0, 3).map((highlight) => (
            <div
              key={highlight.title}
              className={`rounded-2xl border ${story.theme.border} ${story.theme.cardBackground} p-4 shadow-sm backdrop-blur md:hover:-translate-y-1 md:hover:shadow-lg transition`}
            >
              <p className="text-sm font-semibold text-foreground mb-1">
                {highlight.title}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {highlight.description}
              </p>
              {highlight.accent && (
                <p className="mt-2 text-xs uppercase tracking-wide text-foreground/60">
                  {highlight.accent}
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-auto">
          <Link
            href={`/travel/${story.slug}`}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2 text-sm font-medium text-background transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Read the itinerary →
          </Link>
          <Link
            href={`/travel/${story.slug}`}
            className="text-sm font-medium text-foreground/70 hover:text-foreground"
          >
            View gallery
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function TravelStoriesPage({
  stories,
}: {
  stories: TravelStory[];
}) {
  return (
    <div className="relative bg-gradient-to-b from-background via-background/70 to-background pb-16">
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="absolute inset-x-0 -top-32 h-64 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent blur-3xl" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 text-center">
          <span className="mx-auto w-fit rounded-full bg-primary/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-primary">
            Travel Stories
          </span>
          <h1 className="text-3xl sm:text-5xl font-semibold text-foreground">
            Every trip gets its own personality-packed story
          </h1>
          <p className="mx-auto max-w-3xl text-base sm:text-lg text-muted-foreground">
            A living archive of itineraries, hidden gems, and photo journals
            from around the globe. Each journey is curated with custom layouts,
            moods, and highlights so no two stories feel the same.
          </p>
        </div>
      </section>

      <section className="mx-auto flex max-w-6xl flex-col gap-12 px-4">
        {stories.map((story) => (
          <TravelStoryCard key={story.slug} story={story} />
        ))}
      </section>
    </div>
  );
}
