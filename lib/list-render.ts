export type ListVariant = "table" | "ol" | "ul";

export function renderItemListHtml(
  items: {
    title: string;
    url?: string;
    description?: string;
    image?: string;
  }[],
  opts?: { title?: string; variant?: ListVariant },
) {
  const variant: ListVariant = opts?.variant || "ol";
  const safe = items.filter((i) => i && i.title);
  if (!safe.length) return "";

  const escapeHtml = (s: string) =>
    String(s).replace(/[&<>"']/g, (ch) =>
      ch === "&"
        ? "&amp;"
        : ch === "<"
          ? "&lt;"
          : ch === ">"
            ? "&gt;"
            : ch === '"'
              ? "&quot;"
              : "&#39;",
    );

  const heading = opts?.title
    ? `<h2 class="text-xl md:text-2xl font-semibold mb-4">${escapeHtml(
        opts.title,
      )}</h2>`
    : "";

  if (variant === "table") {
    const rows = safe
      .map((it, idx) => {
        const pos = idx + 1;
        const name = it.url
          ? `<a href="${escapeHtml(it.url)}" class="hover:underline" rel="nofollow">${escapeHtml(
              it.title,
            )}</a>`
          : escapeHtml(it.title);
        const img = it.image
          ? `<img src="${escapeHtml(
              it.image,
            )}" alt="${escapeHtml(it.title)}" class="w-12 h-12 object-cover rounded" loading="lazy" />`
          : "";
        const desc = it.description ? escapeHtml(it.description) : "";
        return `<tr>
          <td class="py-2 px-3 w-10 text-muted-foreground">${pos}</td>
          <td class="py-2 px-3">${name}${desc ? `<div class="text-sm text-muted-foreground mt-1">${desc}</div>` : ""}</td>
          <td class="py-2 px-3 w-16">${img}</td>
        </tr>`;
      })
      .join("\n");

    return `<section class="my-6">
  ${heading}
  <div class="overflow-x-auto rounded-md border border-border">
    <table class="min-w-full text-sm bg-card">
      <thead class="bg-muted/40 text-left">
        <tr>
          <th class="py-2 px-3">#</th>
          <th class="py-2 px-3">Item</th>
          <th class="py-2 px-3">Image</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  </div>
</section>`;
  }

  const li = safe
    .map((it, idx) => {
      const name = it.url
        ? `<a href="${escapeHtml(it.url)}" class="hover:underline" rel="nofollow">${escapeHtml(
            it.title,
          )}</a>`
        : escapeHtml(it.title);
      const desc = it.description
        ? `<div class="text-sm text-muted-foreground">${escapeHtml(it.description)}</div>`
        : "";
      return `<li class="mb-2">${name}${desc}</li>`;
    })
    .join("\n");

  const listTagOpen =
    variant === "ul"
      ? `<ul class="list-disc pl-6">`
      : `<ol class="list-decimal pl-6">`;
  const listTagClose = variant === "ul" ? `</ul>` : `</ol>`;
  return `<section class="my-6">${heading}${listTagOpen}\n${li}\n${listTagClose}</section>`;
}

// Replace ITEMLIST placeholders in HTML with rendered markup.
// Supports: <!--ITEMLIST-->, <!--ITEMLIST:table-->, <!--ITEMLIST:ol-->, <!--ITEMLIST:ul-->
export function replaceItemListPlaceholders(
  html: string,
  items: {
    title: string;
    url?: string;
    description?: string;
    image?: string;
  }[],
  opts?: { title?: string },
) {
  if (!html) return html;
  const re =
    /(?:<!--\s*ITEMLIST(?::(table|ol|ul))?\s*-->)|(?:\[\[ITEMLIST(?::(table|ol|ul))?\]\])/gi;
  return html.replace(re, (_m, variant) =>
    renderItemListHtml(items, {
      title: opts?.title,
      variant: (variant as ListVariant) || "ol",
    }),
  );
}
