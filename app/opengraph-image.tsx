import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

const imagePath = join(process.cwd(), "public/opengraph.png");
const image = readFileSync(imagePath).toString("base64");

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "nodejs";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundImage: `url(data:image/png;base64,${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    ),
    size,
  );
}
