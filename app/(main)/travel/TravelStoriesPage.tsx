import Image from "next/image";
import Link from "next/link";
import type { TravelStory, TravelStoryLayout } from "@/lib/travelStories";

const themeStyles: Record<
  TravelStoryLayout,
  {
    badge: string;
    border: string;
    accent: string;
    dot: string;
  }
> = {
  coastal: {
    badge: "bg-sky-100 text-sky-700",
    border: "border-sky-200",
    accent: "text-sky-800",
    dot: "bg-sky-400",
  },
  zen: {
    badge: "bg-emerald-100 text-emerald-700",
    border: "border-emerald-200",
    accent: "text-emerald-700",
    dot: "bg-emerald-400",
  },
  expedition: {
    badge: "bg-amber-100 text-amber-700",
    border: "border-amber-200",
    accent: "text-amber-700",
    dot: "bg-amber-500",
  },
};

function TravelStoryCard({ story }: { story: TravelStory }) {
  const theme = themeStyles[story.theme.layout];
  const previewHighlights = story.highlights.slice(0, 3);

  return (
    <article
      className={`flex flex-col gap-6 rounded-3xl border bg-card p-6 shadow-sm sm:p-8 md:flex-row md:items-stretch ${theme.border}`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl md:w-72">
        <Image
          src={story.coverImage}
          alt={story.coverImageAlt}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 320px, (min-width: 768px) 50vw, 92vw"
          priority
        />
      </div>

      <div className="flex flex-1 flex-col gap-5">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <span className={`rounded-full px-3 py-1 ${theme.badge}`}>
              {story.location}
            </span>
            <span className={`rounded-full px-3 py-1 ${theme.badge}`}>
              {story.dateRange}
            </span>
          </div>
          <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
            {story.title}
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            {story.intro}
          </p>
        </div>

        <ul className="space-y-3 text-sm text-muted-foreground">
          {previewHighlights.map((highlight) => (
            <li key={highlight.title} className="flex gap-3">
              <div>
                <p className="font-medium text-foreground">{highlight.title}</p>
                <p className="text-sm text-muted-foreground">
                  {highlight.description}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-3 pt-1">
          <Link
            href={`/travel/${story.slug}`}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition hover:-translate-y-0.5 hover:bg-foreground/90"
          >
            Read itinerary
          </Link>
          <Link
            href={`/travel/${story.slug}`}
            className={`inline-flex items-center text-sm font-medium ${theme.accent} hover:underline`}
          >
            View full story
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
    <main className="bg-background pb-16">
      <section className="border-b border-border bg-muted/40 py-14">
        <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 text-center sm:gap-5">
          <span className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">
            My Travel Stories
          </span>
          <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
            Real Trips, Honest Memories
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            These aren’t guides or itineraries — they’re personal stories from
            the places I’ve actually been. Each trip captures the feeling, the
            people, and the little moments that made it unforgettable.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-12 flex max-w-5xl flex-col gap-10 px-4 sm:gap-12">
        {stories.map((story) => (
          <TravelStoryCard key={story.slug} story={story} />
        ))}
      </section>
    </main>
  );
}
