import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "QuickQuote — Invoice & Quote Generator (Next.js)",
  description:
    "Create professional invoices and quotes in the browser. Line items, tax, live currency conversion, themes, PDF export, and local drafts. Built with Next.js, React, TypeScript, and Tailwind CSS.",
  authors: [{ name: "Jacob Barrera" }],
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  metadataBase: new URL("https://quickquote-next.vercel.app"),
  openGraph: {
    title: "QuickQuote — Invoice & Quote Generator",
    description:
      "Browser-based invoice and quote builder with live currency rates and PDF export. Next.js + React + TypeScript + Tailwind.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "QuickQuote — Invoice & Quote Generator",
    description: "Next.js portfolio demo: invoices, quotes, live FX rates, PDF export.",
  },
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
