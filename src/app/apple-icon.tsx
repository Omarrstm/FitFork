import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 88,
          fontWeight: 700,
          color: "#ffffff",
          background: "linear-gradient(135deg, #16a34a 0%, #f97316 100%)",
        }}
      >
        FF
      </div>
    ),
    { ...size }
  );
}
