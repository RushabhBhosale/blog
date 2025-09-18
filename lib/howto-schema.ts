export type HowToStep = {
  name: string;
  text?: string;
  image?: string;
};

export const normalizeHowToSteps = (input: any): HowToStep[] => {
  if (!Array.isArray(input)) return [];
  return input
    .map((s) => ({
      name: typeof s?.name === "string" ? s.name.trim() : "",
      text: typeof s?.text === "string" ? s.text.trim() : undefined,
      image: typeof s?.image === "string" ? s.image.trim() : undefined,
    }))
    .filter((s) => s.name);
};

