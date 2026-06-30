import type { Metadata, Viewport } from "next";
import "./globals.css";

const title = "Mousey — Turn any live website into an AI-ready design prompt";
const description =
  "Mousey is a Chrome extension that extracts a live website's complete visual design system — layout, spacing, typography, colors, components — and generates a detailed AI prompt so Claude, v0, Lovable, or Bolt can rebuild a near-match. Runs on local models. No cloud API keys.";

export const metadata: Metadata = {
  metadataBase: new URL("https://mousey.app"),
  title: {
    default: title,
    template: "%s · Mousey",
  },
  description,
  applicationName: "Mousey",
  keywords: [
    "Mousey",
    "website design extraction",
    "AI prompt generator",
    "Chrome extension",
    "design system extraction",
    "AI website builder",
    "v0",
    "Lovable",
    "Bolt",
    "vibe coding",
    "Ollama",
  ],
  authors: [{ name: "Mousey" }],
  creator: "Mousey",
  openGraph: {
    type: "website",
    siteName: "Mousey",
    title,
    description,
    url: "https://mousey.app",
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: "Mousey — Turn any live website into an AI-ready design prompt",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.svg"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#06070b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
