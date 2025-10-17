import { ImageResponse } from "next/og";
import "@/lib/db";
import { dbReady } from "@/lib/db";
import Blog from "@/models/blog";
import he from "he";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export const runtime = "nodejs";

const SITE = "https://dailysparks.in";

const toAbsolute = (path?: string | null) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, SITE).toString();
};

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await dbReady;
  const blog: any = await Blog.findOne({ slug })
    .select("title category metaTitle image")
    .lean();

  const title = blog
    ? he
        .decode(blog.metaTitle || blog.title || "")
        .slice(0, 120)
        .trim() || "Daily Sparks"
    : "Daily Sparks";
  const category = blog?.category || "Daily Sparks Blog";
  const cover = toAbsolute(blog?.image) || `${SITE}/og-cover.png`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          color: "#f8fafc",
          fontFamily: "Geist, Inter, system-ui",
          background:
            "linear-gradient(155deg, rgba(2,6,23,0.9) 0%, rgba(14,165,233,0.65) 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "0",
            backgroundImage: `url(${cover})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.18,
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: "28px",
            fontWeight: 600,
            letterSpacing: "1px",
          }}
        >
          <div
            style={{
              width: "54px",
              height: "54px",
              borderRadius: "17px",
              background:
                "linear-gradient(140deg, rgba(14,165,233,0.18), rgba(14,165,233,0.6))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(226,232,240,0.25)",
            }}
          >
            <span style={{ fontSize: "30px" }}>⚡</span>
          </div>
          Daily Sparks
        </div>

        <div style={{ position: "relative" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              padding: "8px 16px",
              borderRadius: "999px",
              background: "rgba(15,23,42,0.55)",
              fontSize: "22px",
              fontWeight: 600,
              marginBottom: "24px",
              textTransform: "uppercase",
              letterSpacing: "1.6px",
            }}
          >
            {category}
          </div>
          <p
            style={{
              fontSize: "64px",
              fontWeight: 700,
              lineHeight: 1.05,
              margin: 0,
              maxWidth: "860px",
            }}
          >
            {title}
          </p>
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "26px",
            color: "rgba(226,232,240,0.85)",
            fontWeight: 500,
          }}
        >
          <span>{SITE.replace("https://", "")}</span>
          <span style={{ fontSize: "20px" }}>Fresh perspectives, daily.</span>
        </div>
      </div>
    ),
    {
      width: size.width,
      height: size.height,
    }
  );
}
