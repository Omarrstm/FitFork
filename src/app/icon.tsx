import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
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
