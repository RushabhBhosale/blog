import React from "react";

const Loading = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-12 animate-pulse">
      {/* Breadcrumbs */}
      <div className="h-4 w-40 bg-muted rounded mb-4" />

      {/* Cover image */}
      <div className="w-full h-56 sm:h-64 md:h-96 rounded-xl bg-muted mb-6" />

      {/* Title and meta */}
      <div className="space-y-3 mb-6">
        <div className="h-7 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="flex items-center gap-3 mt-2">
          <div className="h-9 w-20 bg-muted rounded-full" />
          <div className="h-9 w-16 bg-muted rounded-full" />
          <div className="h-9 w-14 bg-muted rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Article body */}
        <div className="md:col-span-2 space-y-4">
          <div className="h-4 bg-muted rounded w-11/12" />
          <div className="h-4 bg-muted rounded w-10/12" />
          <div className="h-4 bg-muted rounded w-9/12" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-8/12" />
          <div className="h-64 bg-muted rounded" />
          <div className="h-4 bg-muted rounded w-10/12" />
          <div className="h-4 bg-muted rounded w-9/12" />
          <div className="h-4 bg-muted rounded w-7/12" />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="h-5 bg-muted rounded w-32" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="h-16 w-24 bg-muted rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-10/12" />
                <div className="h-4 bg-muted rounded w-8/12" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
