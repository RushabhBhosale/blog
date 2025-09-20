import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
        {/* Hero */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4">
            <div className="h-8 w-64 bg-muted rounded" />
            <div className="h-6 w-80 bg-muted rounded" />
            <div className="h-4 w-72 bg-muted rounded" />
            <div className="h-10 w-32 bg-muted rounded" />
          </div>
          <div className="h-48 md:h-56 bg-muted rounded-xl" />
        </div>

        {/* Recent grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
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

