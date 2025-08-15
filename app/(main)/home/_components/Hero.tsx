import React from "react";

const Hero = () => {
  return (
    <div className="relative w-full py-8 flex flex-col items-center justify-center text-center px-4">
      <div className="relative z-10 max-w-4xl">
        <div className="inline-flex items-center px-4 py-2 bg-card/70 border border-border rounded-full text-sm font-medium text-foreground mb-8">
          <span className="w-2 h-2 bg-green-200 rounded-full mr-2"></span>
          New posts every week
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Three Worlds, <span className="text-primary">Endless Stories</span>
        </h1>

        <p className="text-lg md:text-xl text-foreground max-w-2xl mb-10 font-light">
          Explore anime adventures, keep up with tech innovations, and plan your
          next travel escape — all in one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          {[
            { name: "Anime", tagline: "Epic stories & hidden gems" },
            { name: "Tech", tagline: "Trends, tips & insights" },
            { name: "Travel", tagline: "Journeys beyond borders" },
          ].map((cat) => (
            <div
              key={cat.name}
              className="group cursor-pointer shadow-2xl/10 rounded-2xl"
            >
              <div className="flex flex-col items-center space-y-1 px-6 py-3 bg-card/80 border border-border rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-foreground font-medium">
                    {cat.name}
                  </span>
                  <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-full">
                    {cat.name === "Anime"
                      ? "24 posts"
                      : cat.name === "Tech"
                      ? "18 posts"
                      : "31 posts"}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {cat.tagline}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
