export type ReviewItem = {
  name?: string; // headline
  reviewBody?: string;
  ratingValue?: number;
  bestRating?: number;
  worstRating?: number;
  author?: string;
  datePublished?: string; // ISO date
};

export const normalizeReviews = (input: any): ReviewItem[] => {
  if (!Array.isArray(input)) return [];
  return input
    .map((r) => ({
      name: typeof r?.name === "string" ? r.name.trim() : undefined,
      reviewBody:
        typeof r?.reviewBody === "string" ? r.reviewBody.trim() : undefined,
      ratingValue:
        typeof r?.ratingValue === "number"
          ? r.ratingValue
          : typeof r?.ratingValue === "string"
          ? Number(r.ratingValue)
          : undefined,
      bestRating:
        typeof r?.bestRating === "number"
          ? r.bestRating
          : typeof r?.bestRating === "string"
          ? Number(r.bestRating)
          : 5,
      worstRating:
        typeof r?.worstRating === "number"
          ? r.worstRating
          : typeof r?.worstRating === "string"
          ? Number(r.worstRating)
          : 1,
      author: typeof r?.author === "string" ? r.author.trim() : undefined,
      datePublished:
        typeof r?.datePublished === "string" ? r.datePublished.trim() : undefined,
    }))
    .filter((r) => r.ratingValue || r.reviewBody || r.name);
};

