export type FaqItem = {
  question: string;
  answer: string;
};

const FAQ_SCRIPT_REGEX = /<script[^>]*type=(['"])application\/ld\+json\1[^>]*>([\s\S]*?)<\/script>/gi;

type ExtractResult = {
  htmlWithoutFaqSchema: string;
  faqs: FaqItem[];
};

const isFaqPagePayload = (payload: any) => {
  if (!payload) return false;

  if (Array.isArray(payload)) {
    return payload.some(isFaqPagePayload);
  }

  if (typeof payload !== "object") return false;

  if (payload["@type"] === "FAQPage") return true;

  if (Array.isArray(payload["@graph"])) {
    return payload["@graph"].some(isFaqPagePayload);
  }

  return false;
};

const extractFaqEntities = (payload: any): any[] => {
  if (!payload) return [];

  if (Array.isArray(payload)) {
    for (const item of payload) {
      const entities = extractFaqEntities(item);
      if (entities.length) return entities;
    }
    return [];
  }

  if (payload["@type"] === "FAQPage" && Array.isArray(payload.mainEntity)) {
    return payload.mainEntity;
  }

  if (Array.isArray(payload["@graph"])) {
    return extractFaqEntities(payload["@graph"]);
  }

  return [];
};

export const extractFaqSchema = (html: string): ExtractResult => {
  if (!html) {
    return { htmlWithoutFaqSchema: html, faqs: [] };
  }

  let faqs: FaqItem[] = [];
  let cleanedHtml = html;
  let match: RegExpExecArray | null;

  const regex = new RegExp(FAQ_SCRIPT_REGEX);

  while ((match = regex.exec(html))) {
    const fullMatch = match[0];
    const jsonContent = (match[2] || "").trim();
    if (!jsonContent) continue;

    try {
      const parsed = JSON.parse(jsonContent);
      if (!isFaqPagePayload(parsed)) continue;

      const entities = extractFaqEntities(parsed);
      if (!entities.length) continue;

      faqs = entities
        .map((entity: any) => {
          const question = typeof entity?.name === "string" ? entity.name.trim() : "";
          const answer = typeof entity?.acceptedAnswer?.text === "string"
            ? entity.acceptedAnswer.text.trim()
            : "";

          if (!question || !answer) return null;
          return { question, answer } as FaqItem;
        })
        .filter(Boolean) as FaqItem[];

      cleanedHtml = cleanedHtml.replace(fullMatch, "");
      break;
    } catch (error) {
      console.warn("Failed to parse FAQ schema", error);
    }
  }

  return {
    htmlWithoutFaqSchema: cleanedHtml.trim(),
    faqs,
  };
};

export const buildFaqJsonLd = (faqs: FaqItem[]): string => {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return JSON.stringify(data, null, 2);
};

export const normalizeFaqItems = (input: any): FaqItem[] => {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => ({
      question: typeof item?.question === "string" ? item.question.trim() : "",
      answer: typeof item?.answer === "string" ? item.answer.trim() : "",
    }))
    .filter((item) => item.question && item.answer);
};

export const injectFaqSchemaIntoHtml = (html: string, jsonLd: string): string => {
  if (!html) return html;
  if (!jsonLd.trim().length) return html;

  const scriptTag = `<script type="application/ld+json">\n${jsonLd}\n</script>`;

  if (/<\/body\s*>/i.test(html)) {
    return html.replace(/<\/body\s*>/i, `${scriptTag}\n</body>`);
  }

  return `${html}\n${scriptTag}`;
};
