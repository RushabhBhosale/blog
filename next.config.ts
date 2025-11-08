import type { NextConfig } from "next";

const CDN_CACHE_HEADER =
  "public, s-maxage=3600, max-age=300, stale-while-revalidate=60";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "images.unsplash.com",
      "cdn.myanimelist.net",
      "dailysparks.in",
    ],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/blog/:slug*",
        headers: [
          {
            key: "Cache-Control",
            value: CDN_CACHE_HEADER,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
