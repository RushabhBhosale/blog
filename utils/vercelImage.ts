export async function getVercelBlobImageUrl(blobUrl: string): Promise<string> {
  try {
    const res = await fetch(blobUrl);
    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
    const data = await res.json();
    return data.file || "";
  } catch (err) {
    console.error("Error fetching Vercel Blob JSON:", err);
    return "";
  }
}
