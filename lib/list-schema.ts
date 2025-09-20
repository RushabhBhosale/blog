export type ListItemInput = {
  title: string;
  url?: string;
  description?: string;
  image?: string;
};

export const normalizeListItems = (input: any): ListItemInput[] => {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => ({
      title: typeof item?.title === "string" ? item.title.trim() : "",
      url: typeof item?.url === "string" ? item.url.trim() : "",
      description:
        typeof item?.description === "string" ? item.description.trim() : "",
      image: typeof item?.image === "string" ? item.image.trim() : "",
    }))
    .filter((i) => i.title.length > 0);
};

export const buildItemListJsonLd = (
  items: ListItemInput[],
  opts?: { name?: string; order?: "Ascending" | "Descending" | "Unordered" }
): string => {
  const itemListElement = items.map((it, idx) => {
    const item: any = { "@type": "Thing", name: it.title };
    if (it.url) item.url = it.url;
    if (it.image) item.image = it.image;
    if (it.description) item.description = it.description;
    return { "@type": "ListItem", position: idx + 1, item };
  });

  const data: any = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement,
  };
  if (opts?.name) data.name = opts.name;
  if (opts?.order) data.itemListOrder = opts.order;
  return JSON.stringify(data, null, 2);
};

// Simple injector (same strategy as FAQ injector)
export const injectListSchemaIntoHtml = (html: string, jsonLd: string): string => {
  if (!html) return html;
  if (!jsonLd.trim().length) return html;
  const scriptTag = `<script type="application/ld+json">\n${jsonLd}\n</script>`;
  if (/<\/body\s*>/i.test(html)) {
    return html.replace(/<\/body\s*>/i, `${scriptTag}\n</body>`);
  }
  return `${html}\n${scriptTag}`;
};

