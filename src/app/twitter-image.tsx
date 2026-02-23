import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "SecretInk - Anonymous thoughts, authentic voices";
export const size = {
  width: 1200,
  height: 600,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0a0a0a",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Radial grid pattern background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(34, 211, 238, 1.0) 2px, transparent 2px)",
          backgroundSize: "40px 40px",
          opacity: 0.4,
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 50%, black 0%, transparent 80%)",
        }}
      />

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Icon with neo-brutalist styling */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 100,
              height: 100,
              background: "#22d3ee",
              borderRadius: 16,
              transform: "translate(6px, 6px)",
              opacity: 0.4,
            }}
          />
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 100,
              height: 100,
              background: "rgba(20, 20, 20, 0.7)",
              backdropFilter: "blur(12px)",
              borderRadius: 16,
              border: "4px solid #22d3ee",
            }}
          >
            <svg
              width="56"
              height="56"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#22d3ee"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <line x1="9" y1="10" x2="15" y2="10" />
              <line x1="12" y1="7" x2="12" y2="13" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 88,
            fontWeight: 900,
            color: "#f5f5f5",
            marginBottom: 20,
            letterSpacing: "-0.05em",
            fontFamily: "serif",
          }}
        >
          SecretInk
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 500,
            color: "#a1a1aa",
            maxWidth: 700,
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          Anonymous thoughts, authentic voices.
        </div>

        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 32,
            padding: "10px 20px",
            background: "#22d3ee",
            borderRadius: 999,
            fontSize: 16,
            fontWeight: 900,
            color: "#0a0a0a",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Private Boards
        </div>
      </div>

      {/* Neo-brutalist accent shapes */}
      <div
        style={{
          position: "absolute",
          top: 70,
          right: 70,
          width: 70,
          height: 70,
          background: "#22d3ee",
          opacity: 0.15,
          borderRadius: 12,
          transform: "rotate(15deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 90,
          left: 90,
          width: 90,
          height: 90,
          border: "4px solid #22d3ee",
          opacity: 0.15,
          borderRadius: 12,
          transform: "rotate(-10deg)",
        }}
      />
    </div>,
    {
      ...size,
    },
  );
}
