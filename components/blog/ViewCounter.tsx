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
    if (!slug || typeof window === "undefined") return;
    const key = `viewed:${slug}`;
    if (sessionStorage.getItem(key)) return;

    const run = async () => {
      try {
        sessionStorage.setItem(key, "1");
        const res = await axiosClient.post(`/blog/${slug}/views`);
        if (typeof res.data?.views === "number") {
          setViews(res.data.views);
        }
      } catch {
        // Ignore view increment errors silently
      }
    };

    const win = window as any;
    if (typeof win.requestIdleCallback === "function") {
      const idleId = win.requestIdleCallback(run, { timeout: 2000 });
      return () => {
        if (typeof win.cancelIdleCallback === "function") {
          win.cancelIdleCallback(idleId);
        }
      };
    }

    const timer = window.setTimeout(run, 1500);
    return () => window.clearTimeout(timer);
  }, [slug]);

  return <span>• {views} views</span>;
}
