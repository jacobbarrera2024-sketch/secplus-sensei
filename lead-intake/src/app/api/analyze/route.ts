import { NextResponse } from "next/server";
import { analyzeProblem } from "@/lib/ai";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { problemDescription?: string };
    const problemDescription = body.problemDescription?.trim() ?? "";

    if (problemDescription.length < 8) {
      return NextResponse.json(
        { error: "Please enter at least a few words describing your project." },
        { status: 400 },
      );
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "anonymous";

    const { allowed, remaining } = checkRateLimit(`analyze:${ip}`);
    if (!allowed) {
      return NextResponse.json(
        { error: "Rate limit reached. Try again in a little while." },
        { status: 429 },
      );
    }

    const result = await analyzeProblem(problemDescription);

    return NextResponse.json({ ...result, remaining });
  } catch {
    return NextResponse.json(
      { error: "Could not analyze request right now." },
      { status: 500 },
    );
  }
}
