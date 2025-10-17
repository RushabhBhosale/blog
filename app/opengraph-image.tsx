import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0ea5e9 100%)",
          color: "#f8fafc",
          fontFamily: "Geist, Inter, system-ui",
        }}
      >
        <div
          style={{
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
              width: "56px",
              height: "56px",
              borderRadius: "18px",
              background:
                "linear-gradient(130deg, rgba(14,165,233,0.25), rgba(14,165,233,0.6))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(226,232,240,0.2)",
            }}
          >
            <span style={{ fontSize: "30px" }}>⚡</span>
          </div>
          Daily Sparks
        </div>
        <div>
          <p
            style={{
              fontSize: "72px",
              fontWeight: 700,
              margin: 0,
              lineHeight: 1.05,
            }}
          >
            Fresh Ideas, Every Day
          </p>
          <p
            style={{
              marginTop: "20px",
              fontSize: "30px",
              color: "rgba(226,232,240,0.78)",
              fontWeight: 500,
              letterSpacing: "0.5px",
            }}
          >
            Anime • Tech • Travel • Media
          </p>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "26px",
            color: "rgba(226,232,240,0.85)",
            fontWeight: 500,
          }}
        >
          <span>dailysparks.in</span>
          <span style={{ fontSize: "20px" }}>Stay curious, stay inspired.</span>
        </div>
      </div>
    ),
    size,
  );
}
