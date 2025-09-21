import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100vh",
          backgroundImage: "url(http://localhost:3000/og-cover.png)",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
    ),
    size,
  );
}
