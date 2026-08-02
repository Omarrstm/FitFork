import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0f1712 0%, #16241a 55%, #2a1f10 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#86efac",
            marginBottom: 24,
          }}
        >
          Home-cooked, tracked to the macro
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 700,
            color: "#ffffff",
            marginBottom: 24,
          }}
        >
          FitFork
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 32,
            color: "#d4d4d8",
            maxWidth: 900,
          }}
        >
          Meals that fit your macros, made by real cooks.
        </div>
      </div>
    ),
    { ...size }
  );
}
