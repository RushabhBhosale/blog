const POST_DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export function formatPostDate(input?: string | number | Date | null): string {
  if (input === undefined || input === null) return "";
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return "";
  return POST_DATE_FORMAT.format(date);
}
