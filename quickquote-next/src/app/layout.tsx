import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

const portfolioOgImage =
  "https://jacobbarrera2024-sketch.github.io/secplus-sensei/assets/og-image.png";

export const metadata: Metadata = {
  title: "QuickQuote — Invoice & Quote Generator (Next.js)",
  description:
    "Create professional invoices and quotes in the browser. Line items, tax, live currency conversion, themes, PDF export, and local drafts. Built with Next.js, React, TypeScript, and Tailwind CSS.",
  authors: [{ name: "Jacob Barrera" }],
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  openGraph: {
    title: "QuickQuote — Invoice & Quote Generator",
    description:
      "Browser-based invoice and quote builder with live currency rates and PDF export. Next.js + React + TypeScript + Tailwind.",
    type: "website",
    images: [
      {
        url: portfolioOgImage,
        width: 1200,
        height: 630,
        alt: "Jacob — Developer portfolio preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QuickQuote — Invoice & Quote Generator",
    description: "Next.js portfolio demo: invoices, quotes, live FX rates, PDF export.",
    images: [portfolioOgImage],
  },
};

export const viewport: Viewport = {
  themeColor: "#0f766e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
