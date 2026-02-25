import { ImageResponse } from "next/og";

export const runtime = "edge";

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
          backgroundColor: "#0a0a0a",
          position: "relative",
        }}
      >
        {/* Teal background with neo-brutalist offset shadow */}
        <div
          style={{
            position: "absolute",
            width: 140,
            height: 140,
            background: "#22d3ee",
            borderRadius: 32,
            transform: "translate(4px, 4px)",
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
            width: 140,
            height: 140,
            background: "#22d3ee",
            borderRadius: 32,
            border: "6px solid #0a0a0a",
          }}
        >
          {/* "M" letter */}
          <div
            style={{
              fontSize: 96,
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
