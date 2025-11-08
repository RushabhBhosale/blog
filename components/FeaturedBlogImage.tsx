"use client";

import { useEffect, useState } from "react";
import { getVercelBlobImageUrl } from "@/utils/vercelImage";

export default function FeaturedBlogImage({
  blobUrl,
  title,
}: {
  blobUrl: string;
  title: string;
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUrl = async () => {
      const url = await getVercelBlobImageUrl(blobUrl);
      setImageUrl(url);
    };
    fetchUrl();
  }, [blobUrl]);

  if (!imageUrl) return null;

  return (
    <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
  );
}
