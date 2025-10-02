"use client";

import { useEffect, useState } from "react";
import axiosClient from "@/lib/axiosclient";

type Props = {
  slug: string;
  initialViews: number;
};

export default function ViewCounter({ slug, initialViews }: Props) {
  const [views, setViews] = useState(initialViews);

  useEffect(() => {
    if (!slug) return;
    const key = `viewed:${slug}`;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    (async () => {
      try {
        const res = await axiosClient.post(`/blog/${slug}/views`);
        if (typeof res.data?.views === "number") {
          setViews(res.data.views);
        }
      } catch {
        // Ignore view increment errors silently
      }
    })();
  }, [slug]);

  return <span>• {views} views</span>;
}

