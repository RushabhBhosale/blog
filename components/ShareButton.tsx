"use client";

export default function ShareButton({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  async function onShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {}
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        alert("Link copied");
      } catch {}
    }
  }

  return (
    <button
      onClick={onShare}
      aria-label="Share"
      className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-sm hover:bg-accent transition"
    >
      Share
    </button>
  );
}
