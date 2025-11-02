import { cookies } from "next/headers";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function MALSuccessPage() {
  const jar = await cookies();
  const hasAccessToken = Boolean(jar.get("mal_access_token")?.value);
  console.info("[MAL/success] Rendering success page", { hasAccessToken });

  return (
    <main className="mx-auto flex max-w-xl flex-col items-center justify-center gap-6 py-16 text-center">
      <h1 className="text-3xl font-semibold">MyAnimeList Connected</h1>
      {hasAccessToken ? (
        <p className="text-muted-foreground">
          You&apos;re all set! We saved your MAL token and can now sync your
          watchlist.
        </p>
      ) : (
        <p className="text-destructive">
          We couldn&apos;t detect a MAL access token. Please try logging in
          again.
        </p>
      )}
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/mal/watchlist"
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground transition hover:opacity-90"
        >
          View Watchlist
        </Link>
        <Link
          href="/home"
          className="rounded-md border border-border px-4 py-2 transition hover:bg-muted"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
