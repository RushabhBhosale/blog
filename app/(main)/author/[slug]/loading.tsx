import React from "react";

const Loading = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      {/* Breadcrumb */}
      <div className="h-4 w-40 bg-muted rounded mb-3" />

      {/* Header */}
      <div className="flex items-start gap-4 md:gap-6 mb-8">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-muted" />
        <div className="flex-1 space-y-3">
          <div className="h-7 w-64 bg-muted rounded" />
          <div className="h-4 w-40 bg-muted rounded" />
          <div className="flex gap-2">
            <div className="h-6 w-24 bg-muted rounded-full" />
            <div className="h-6 w-20 bg-muted rounded-full" />
            <div className="h-6 w-16 bg-muted rounded-full" />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-lg overflow-hidden border border-border bg-card">
            <div className="w-full h-44 bg-muted" />
            <div className="p-4 space-y-2">
              <div className="h-4 w-20 bg-muted rounded" />
              <div className="h-5 w-10/12 bg-muted rounded" />
              <div className="h-4 w-7/12 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;

