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

export const metadata: Metadata = {
  title: "LeadDesk — AI Lead Intake + Admin Dashboard",
  description:
    "Multi-step client intake form with AI summary tagging and a Supabase-powered admin dashboard. Next.js, TypeScript, Tailwind, Vercel AI SDK.",
  authors: [{ name: "Jacob Barrera" }],
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  openGraph: {
    title: "LeadDesk — AI Lead Intake Demo",
    description:
      "Portfolio demo: smart lead intake, OpenAI categorization, Supabase auth + Postgres admin table.",
    type: "website",
    images: [{ url: "/icon.svg", width: 64, height: 64, alt: "LeadDesk icon" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
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
      <body className="min-h-full bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}
