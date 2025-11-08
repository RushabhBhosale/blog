import { parse } from "node-html-parser";

export type TocItem = { id: string; text: string; level: number };

const DEFAULT_IMAGE_WIDTH = 1280;
const DEFAULT_IMAGE_HEIGHT = 720;
const DEFAULT_SIZES = "(max-width: 768px) 100vw, 768px";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s/|]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");

const toNumber = (value?: string | null) => {
  if (!value) return undefined;
  const parsed = Number(value.toString().replace(/px$/i, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

const inferRatioFromSrc = (src?: string | null) => {
  if (!src) return undefined;
  try {
    const url = new URL(src, "https://dailysparks.in");
    const wParam =
      toNumber(url.searchParams.get("w")) ||
      toNumber(url.searchParams.get("width"));
    const hParam =
      toNumber(url.searchParams.get("h")) ||
      toNumber(url.searchParams.get("height"));
    if (wParam && hParam) {
      return wParam / hParam;
    }
  } catch {
    /* ignore invalid URLs */
  }

  const cloudinaryMatch = src.match(/(?:,|\/)(w_(\d+))(?:,|\/)/);
  const cloudinaryHeight = src.match(/(?:,|\/)(h_(\d+))(?:,|\/)/);
  const width = cloudinaryMatch ? Number(cloudinaryMatch[2]) : undefined;
  const height = cloudinaryHeight ? Number(cloudinaryHeight[2]) : undefined;
  if (width && height) {
    return width / height;
  }
  return undefined;
};

const mergeStyle = (existing: string | null, addition: string) => {
  const set = new Map<string, string>();
  const normalize = (decl: string) => decl.trim().toLowerCase();
  (existing || "")
    .split(";")
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .forEach((decl) => {
      const [prop, ...rest] = decl.split(":");
      if (!prop || !rest.length) return;
      set.set(normalize(prop), `${prop.trim()}:${rest.join(":").trim()}`);
    });
  const additionProp = addition.split(":")[0];
  if (additionProp) {
    set.set(normalize(additionProp), addition);
  }
  return Array.from(set.values()).join("; ");
};

export const prepareArticleContent = (html: string) => {
  if (!html?.trim().length) {
    return { html, toc: [] as TocItem[] };
  }

  const root = parse(html, {
    blockTextElements: {
      script: true,
      noscript: true,
      style: true,
      pre: false,
    },
  });

  const toc: TocItem[] = [];
  const headingCounts = new Map<string, number>();

  root.querySelectorAll("h2, h3").forEach((heading, index) => {
    const text = heading.text.trim();
    if (!text) return;
    const level = heading.tagName.toLowerCase() === "h3" ? 3 : 2;
    let baseId = heading.getAttribute("id") || slugify(text);
    if (!baseId.length) baseId = `section-${index + 1}`;
    const count = headingCounts.get(baseId) || 0;
    headingCounts.set(baseId, count + 1);
    const id = count ? `${baseId}-${count + 1}` : baseId;
    if (count) headingCounts.set(id, 1);
    heading.setAttribute("id", id);
    toc.push({ id, text, level });
  });

  root.querySelectorAll("img").forEach((node, index) => {
    const alt = node.getAttribute("alt");
    if (!alt || !alt.trim().length) {
      const fallback = node.getAttribute("title") || `Article illustration ${index + 1}`;
      node.setAttribute("alt", fallback);
    }

    let width =
      toNumber(node.getAttribute("width")) ||
      toNumber(node.getAttribute("data-width"));
    let height =
      toNumber(node.getAttribute("height")) ||
      toNumber(node.getAttribute("data-height"));

    if (!width || !height) {
      const ratio = inferRatioFromSrc(node.getAttribute("src")) ||
        DEFAULT_IMAGE_WIDTH / DEFAULT_IMAGE_HEIGHT;
      if (!width && height) {
        width = Math.round(height * ratio);
      } else if (width && !height) {
        height = Math.max(1, Math.round(width / ratio));
      } else if (!width && !height) {
        width = DEFAULT_IMAGE_WIDTH;
        height = Math.round(width / ratio);
      }
    }

    if (!width) width = DEFAULT_IMAGE_WIDTH;
    if (!height) height = DEFAULT_IMAGE_HEIGHT;

    node.setAttribute("width", String(width));
    node.setAttribute("height", String(height));

    const aspect = Math.max(0.1, Number((width / height).toFixed(5)));
    const currentStyle = node.getAttribute("style") || "";
    const nextStyle = mergeStyle(currentStyle, `--img-aspect:${aspect}`);
    node.setAttribute("style", nextStyle);
    node.setAttribute("data-aspect", aspect.toString());

    if (!node.getAttribute("sizes")) {
      node.setAttribute("sizes", DEFAULT_SIZES);
    }
    if (!node.getAttribute("loading")) {
      node.setAttribute("loading", "lazy");
    }
    if (!node.getAttribute("decoding")) {
      node.setAttribute("decoding", "async");
    }
  });

  return { html: root.toString(), toc };
};
