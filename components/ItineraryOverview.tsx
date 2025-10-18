"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { TravelStoryItineraryItem } from "@/lib/travelStories";
import { cn } from "@/lib/utils";

type ThemeClasses = {
  border: string;
  accent: string;
  muted: string;
};

type ItineraryOverviewProps = {
  itinerary: TravelStoryItineraryItem[];
  theme: ThemeClasses;
};

const COLLAPSED_ITEMS = 3;

export default function ItineraryOverview({
  itinerary,
  theme,
}: ItineraryOverviewProps) {
  const [expanded, setExpanded] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const shouldAllowToggle = itinerary.length > COLLAPSED_ITEMS;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollOffset = 80;

  useEffect(() => {
    if (expanded || !hasInteracted || !shouldAllowToggle) {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    const viewportTop = container.getBoundingClientRect().top;
    if (viewportTop >= scrollOffset) {
      return;
    }

    const target = window.scrollY + viewportTop - scrollOffset;

    window.scrollTo({
      top: Math.max(target, 0),
      behavior: "smooth",
    });
  }, [expanded, hasInteracted, scrollOffset, shouldAllowToggle]);

  const handleToggle = () => {
    setHasInteracted(true);
    setExpanded((value) => !value);
  };

  return (
    <div ref={containerRef} className="space-y-5">
      <div className="relative">
        <div
          className={cn(
            "space-y-6 transition-[max-height] duration-300 ease-in-out",
            expanded ? "max-h-none" : "max-h-[420px] overflow-hidden"
          )}
        >
          {itinerary.map((day) => (
            <article key={day.dayLabel} className="relative">
              <div
                className={cn(
                  "rounded-xl border bg-card p-4 shadow-sm",
                  theme.border
                )}
              >
                <p
                  className={cn(
                    "text-xs font-semibold uppercase",
                    theme.accent
                  )}
                >
                  {day.dayLabel}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-foreground">
                  {day.title}
                </h3>
                <p className={cn("mt-2 text-sm leading-relaxed", theme.muted)}>
                  {day.description}
                </p>
                {day.highlights && (
                  <ul className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {day.highlights.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-border px-3 py-1"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}
        </div>
        {!expanded && shouldAllowToggle && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent backdrop-blur-sm" />
        )}
      </div>

      {shouldAllowToggle && (
        <button
          type="button"
          onClick={handleToggle}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:-translate-y-0.5 hover:bg-muted/40"
          aria-expanded={expanded}
        >
          <span>{expanded ? "Show less" : "View full itinerary"}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              expanded && "rotate-180"
            )}
          />
        </button>
      )}
    </div>
  );
}
