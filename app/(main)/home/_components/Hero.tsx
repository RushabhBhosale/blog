import { Badge } from "@/components/ui/badge";
import React from "react";

const Hero = () => {
  return (
    <div className="relative w-full py-14 flex flex-col items-center justify-center text-center px-4">
      <div className="relative z-10 max-w-4xl">
        <div className="inline-flex items-center px-4 py-2 bg-card/70 border border-border rounded-full text-sm font-medium text-foreground mb-8">
          <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
          Daily Sparks ⚡ Fresh ideas, every day
        </div>

        <h1 className="text-3xl md:text-6xl font-extrabold mb-6 leading-tight">
          Ignite Your Curiosity with{" "}
          <span className="text-primary">Daily Sparks</span>
        </h1>

        <p className="text-lg md:text-xl text-foreground mb-10 font-light text-center">
          From anime sagas to the latest tech trends, and travel escapes across
          the globe — discover stories that spark inspiration, knowledge, and
          adventure.
        </p>

        <div className="flex flex-row gap-6 justify-center items-center">
          {[
            {
              name: "Anime",
              tagline: "Epic tales, reviews & hidden gems",
              posts: "10+",
            },
            {
              name: "Tech",
              tagline: "Trends, tools & smart insights",
              posts: "10+",
            },
            {
              name: "Travel",
              tagline: "Guides, tips & global escapes",
              posts: "10+",
            },
          ].map((cat, idx) => (
            <div key={idx}>
              <div className="hidden md:block group cursor-pointer transition hover:shadow-2xl/5 rounded-2xl">
                <div className="flex flex-col items-center space-y-1 px-6 py-4 bg-card/80 border border-border rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="text-foreground font-semibold">
                      {cat.name}
                    </span>
                    <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-full">
                      {cat.posts} posts
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {cat.tagline}
                  </span>
                </div>
              </div>

              <div className="md:hidden">
                <Badge
                  variant="outline"
                  className="rounded-full px-4 py-2 flex items-center gap-1 text-sm"
                >
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="font-medium">{cat.name}</span>
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
