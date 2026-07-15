import { NextResponse } from "next/server";
import type { ExchangeResponse } from "@/lib/types";

// Runs as a Node.js serverless function on Vercel (not the edge runtime),
// so the external REST call happens server-side and the client never talks
// to the third-party API directly.
export const runtime = "nodejs";
export const revalidate = 3600; // cache upstream rates for an hour

const SUPPORTED = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "MXN", "INR"];
const UPSTREAM = "https://api.frankfurter.app/latest";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const base = (searchParams.get("base") || "USD").toUpperCase();

  if (!SUPPORTED.includes(base)) {
    return NextResponse.json(
      { error: `Unsupported base currency: ${base}` },
      { status: 400 },
    );
  }

  const symbols = SUPPORTED.filter((code) => code !== base).join(",");

  try {
    const upstream = await fetch(`${UPSTREAM}?from=${base}&to=${symbols}`, {
      headers: { Accept: "application/json" },
      next: { revalidate },
    });

    if (!upstream.ok) {
      throw new Error(`Upstream responded ${upstream.status}`);
    }

    const data = (await upstream.json()) as {
      base: string;
      date: string;
      rates: Record<string, number>;
    };

    const payload: ExchangeResponse = {
      base: data.base ?? base,
      date: data.date ?? new Date().toISOString().slice(0, 10),
      rates: { [base]: 1, ...data.rates },
    };

    return NextResponse.json(payload, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Could not load live exchange rates (${message}).` },
      { status: 502 },
    );
  }
}
