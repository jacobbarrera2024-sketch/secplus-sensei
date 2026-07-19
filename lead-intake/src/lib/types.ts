export type LeadStatus = "new" | "scheduled" | "archived";

export const LEAD_STATUSES: LeadStatus[] = ["new", "scheduled", "archived"];

export const SERVICE_OPTIONS = [
  "Web Development",
  "UI / Design",
  "Consulting",
  "Other",
] as const;

export type ServiceOption = (typeof SERVICE_OPTIONS)[number];

export interface Lead {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company: string | null;
  service: string;
  problem_description: string;
  ai_summary: string | null;
  ai_tags: string[] | null;
  status: LeadStatus;
}

export interface IntakeFormData {
  name: string;
  email: string;
  company: string;
  service: ServiceOption;
  problemDescription: string;
}

export interface AnalyzeResult {
  summary: string;
  tags: string[];
  mode: "ai" | "demo";
}

export interface CreateLeadPayload {
  name: string;
  email: string;
  company?: string;
  service: string;
  problemDescription: string;
  aiSummary?: string;
  aiTags?: string[];
}
