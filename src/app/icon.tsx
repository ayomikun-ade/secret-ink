import { ImageResponse } from "next/og";

export const runtime = "edge";

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
          backgroundColor: "#0a0a0a",
          position: "relative",
        }}
      >
        {/* Teal background square with neo-brutalist offset */}
        <div
          style={{
            position: "absolute",
            width: 28,
            height: 28,
            background: "#22d3ee",
            borderRadius: 6,
            transform: "translate(1px, 1px)",
            opacity: 0.3,
          }}
        />
        {/* Main icon container */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 28,
            height: 28,
            background: "#22d3ee",
            borderRadius: 6,
            border: "2px solid #0a0a0a",
          }}
        >
          {/* "M" letter */}
          <div
            style={{
              fontSize: 20,
              fontWeight: 900,
              color: "#0a0a0a",
              letterSpacing: "-0.05em",
              fontFamily: "serif",
              lineHeight: 1,
            }}
          >
            M
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
