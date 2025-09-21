import React from "react";

const Loading = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-7 w-64 bg-muted rounded mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl overflow-hidden border border-border bg-card"
          >
            <div className="w-full h-40 bg-muted" />
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
