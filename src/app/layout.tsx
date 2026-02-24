import type { Metadata } from "next";
import { Geist, JetBrains_Mono, Crimson_Pro } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";

const fontSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fontSerif = Crimson_Pro({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fontMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Murmer - Anonymous Messaging",
  description:
    "Share thoughts anonymously on private boards. Perfect for feedback, Q&A, and authentic conversations.",
  keywords: [
    "anonymous messaging",
    "private boards",
    "feedback",
    "Q&A",
    "confessions",
    "anonymous thoughts",
  ],
  authors: [{ name: "Murmer" }],
  creator: "Murmer",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://secret-ink.pxxl.click",
    title: "Murmer - Anonymous Messaging",
    description:
      "Share thoughts anonymously on private boards. Perfect for feedback, Q&A, and authentic conversations.",
    siteName: "Murmer",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Murmer - Anonymous thoughts, authentic voices",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Murmer - Anonymous Messaging",
    description:
      "Share thoughts anonymously on private boards. Perfect for feedback, Q&A, and authentic conversations.",
    creator: "@theayomikunade",
    images: ["/twitter-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://secret-ink.pxxl.click"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fontSans.variable} ${fontMono.variable} ${fontSerif.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
