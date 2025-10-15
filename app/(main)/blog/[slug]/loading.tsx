"use client";

import Skeleton from "@/components/ui/skeleton";

export default function BlogLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-8">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-12 w-3/4 rounded-xl" />
          <Skeleton className="w-full h-72 rounded-2xl" />
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton key={idx} className="h-5 w-full rounded-md" />
            ))}
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={idx} className="h-9 w-20 rounded-full" />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-6 w-40 rounded-md" />
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="flex gap-3">
              <Skeleton className="h-20 w-20 rounded-lg" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-1/2 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
