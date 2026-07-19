import { z } from "zod";

export const PORTFOLIO_URL =
  "https://jacobbarrera2024-sketch.github.io/secplus-sensei/";

export const MIN_PROBLEM_LENGTH = 12;

const emailSchema = z.string().trim().email().max(254);

export function isValidEmail(value: string): boolean {
  return emailSchema.safeParse(value).success;
}

export function safeNextPath(raw: string | null | undefined): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return "/admin";
  }
  return raw;
}

export const analyzeBodySchema = z.object({
  problemDescription: z.string().trim().min(MIN_PROBLEM_LENGTH).max(5000),
});

export const createLeadSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: emailSchema,
  company: z.string().trim().max(200).optional(),
  service: z.string().trim().min(1).max(100),
  problemDescription: z.string().trim().min(MIN_PROBLEM_LENGTH).max(5000),
  aiSummary: z.string().trim().max(2000).optional(),
  aiTags: z.array(z.string().trim().min(1).max(50)).max(10).optional(),
});

export const updateLeadSchema = z.object({
  status: z.enum(["new", "scheduled", "archived"]),
});

export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "anonymous"
  );
}
