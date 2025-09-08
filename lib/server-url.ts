export function getBaseUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) return `https://${vercelUrl}`;
  return "http://localhost:3000";
}

export function apiUrl(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${getBaseUrl()}/api${p}`;
}

