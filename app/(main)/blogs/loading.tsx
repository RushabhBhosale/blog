import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Heading */}
        <div className="h-8 w-56 bg-muted rounded mb-6" />

        {/* Filters */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-10 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
          </div>
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
            <div className="h-4 w-64 bg-muted rounded" />
            <div className="h-7 w-24 bg-muted rounded-full" />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden border border-border bg-card">
              <div className="w-full h-44 bg-muted" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-20 bg-muted rounded" />
                <div className="h-5 w-11/12 bg-muted rounded" />
                <div className="h-4 w-8/12 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;

