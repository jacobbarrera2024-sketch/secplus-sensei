import { NextResponse } from "next/server";
import { analyzeProblem } from "@/lib/ai";
import { checkRateLimit } from "@/lib/rate-limit";
import { analyzeBodySchema, getClientIp } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const parsed = analyzeBodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please enter at least a few words describing your project." },
        { status: 400 },
      );
    }

    const ip = getClientIp(request);
    const { allowed, remaining } = checkRateLimit(`analyze:${ip}`);
    if (!allowed) {
      return NextResponse.json(
        { error: "Rate limit reached. Try again in a little while." },
        { status: 429 },
      );
    }

    const result = await analyzeProblem(parsed.data.problemDescription);

    return NextResponse.json({ ...result, remaining });
  } catch {
    return NextResponse.json(
      { error: "Could not analyze request right now." },
      { status: 500 },
    );
  }
}
