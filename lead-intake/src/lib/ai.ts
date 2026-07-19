import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import type { AnalyzeResult } from "@/lib/types";
import { MIN_PROBLEM_LENGTH } from "@/lib/validation";

const analyzeSchema = z.object({
  summary: z
    .string()
    .describe("One or two sentence summary of the business problem"),
  tags: z
    .array(z.string())
    .min(2)
    .max(5)
    .describe("Short category tags like 'E-commerce', 'SEO', 'Dashboard'"),
});

const TAG_KEYWORDS: Record<string, string[]> = {
  Ecommerce: ["shop", "store", "cart", "checkout", "product", "woocommerce"],
  SEO: ["seo", "google", "search", "ranking", "traffic"],
  Dashboard: ["dashboard", "admin", "report", "analytics", "metrics"],
  "Mobile App": ["mobile", "ios", "android", "app store"],
  Integration: ["api", "integrate", "sync", "webhook", "stripe", "paypal"],
  Redesign: ["redesign", "refresh", "modernize", "ui", "ux", "layout"],
  Performance: ["slow", "speed", "performance", "optimize", "lighthouse"],
  Authentication: ["login", "auth", "signup", "user account", "password"],
};

export function demoAnalyze(problemDescription: string): AnalyzeResult {
  const text = problemDescription.trim();
  const lower = text.toLowerCase();
  const firstSentence = text.split(/[.!?]/)[0]?.trim() || text.slice(0, 160);
  const summary =
    firstSentence.length > 180
      ? `${firstSentence.slice(0, 177)}…`
      : firstSentence || "General project inquiry";

  const tags = new Set<string>();
  for (const [tag, keywords] of Object.entries(TAG_KEYWORDS)) {
    if (keywords.some((keyword) => lower.includes(keyword))) {
      tags.add(tag);
    }
  }

  if (tags.size === 0) {
    tags.add("General");
    tags.add("Web Project");
  }

  return {
    summary,
    tags: [...tags].slice(0, 5),
    mode: "demo",
  };
}

export async function analyzeProblem(
  problemDescription: string,
): Promise<AnalyzeResult> {
  const trimmed = problemDescription.trim();
  if (trimmed.length < MIN_PROBLEM_LENGTH) {
    return demoAnalyze(trimmed);
  }

  if (!process.env.OPENAI_API_KEY) {
    return demoAnalyze(trimmed);
  }

  try {
    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: analyzeSchema,
      prompt: `You categorize inbound client project requests for a professional services firm.
Summarize the problem clearly and assign 2-5 short tags.

Client request:
"""
${trimmed.slice(0, 4000)}
"""`,
    });

    return {
      summary: object.summary.trim(),
      tags: object.tags.map((tag) => tag.trim()).filter(Boolean).slice(0, 5),
      mode: "ai",
    };
  } catch {
    return demoAnalyze(trimmed);
  }
}
