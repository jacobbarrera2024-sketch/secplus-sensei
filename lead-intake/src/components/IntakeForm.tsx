"use client";

import { useMemo, useState } from "react";
import {
  SERVICE_OPTIONS,
  type AnalyzeResult,
  type IntakeFormData,
  type ServiceOption,
} from "@/lib/types";

const STEPS = ["Contact", "Service", "Project", "Review"] as const;

const initialForm: IntakeFormData = {
  name: "",
  email: "",
  company: "",
  service: SERVICE_OPTIONS[0],
  problemDescription: "",
};

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-200">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-slate-400">{hint}</span> : null}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30";

export function IntakeForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<IntakeFormData>(initialForm);
  const [analysis, setAnalysis] = useState<AnalyzeResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const progress = useMemo(
    () => Math.round(((step + 1) / STEPS.length) * 100),
    [step],
  );

  function updateField<K extends keyof IntakeFormData>(
    key: K,
    value: IntakeFormData[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setError(null);
  }

  function validateStep(currentStep: number): string | null {
    if (currentStep === 0) {
      if (!form.name.trim()) return "Name is required.";
      if (!form.email.trim()) return "Email is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
        return "Enter a valid email address.";
      }
    }

    if (currentStep === 1 && !form.service) {
      return "Choose a service.";
    }

    if (currentStep === 2) {
      if (form.problemDescription.trim().length < 12) {
        return "Describe your project in at least a sentence or two.";
      }
    }

    return null;
  }

  async function runAnalysis() {
    setAnalyzing(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemDescription: form.problemDescription }),
      });

      const data = (await response.json()) as AnalyzeResult & { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Analysis failed");
      }

      setAnalysis({
        summary: data.summary,
        tags: data.tags,
        mode: data.mode,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  }

  async function goNext() {
    const validationError = validateStep(step);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (step === 2 && !analysis) {
      await runAnalysis();
    }

    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  }

  function goBack() {
    setError(null);
    setStep((current) => Math.max(current - 1, 0));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          service: form.service,
          problemDescription: form.problemDescription,
          aiSummary: analysis?.summary,
          aiTags: analysis?.tags,
        }),
      });

      const data = (await response.json()) as { id?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Submission failed");
      }

      setSubmittedId(data.id ?? "saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (submittedId) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">
          Request received
        </p>
        <h2 className="mt-3 text-2xl font-bold text-white">Thanks, {form.name}.</h2>
        <p className="mt-3 text-sm leading-relaxed text-emerald-100/90">
          Your project details were saved. A team member can review them in the admin
          dashboard and follow up by email.
        </p>
        <button
          type="button"
          className="mt-6 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-emerald-950 hover:bg-emerald-400"
          onClick={() => {
            setSubmittedId(null);
            setStep(0);
            setForm(initialForm);
            setAnalysis(null);
          }}
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-indigo-950/30 sm:p-8">
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between text-xs font-medium uppercase tracking-wider text-slate-400">
          <span>
            Step {step + 1} of {STEPS.length}
          </span>
          <span>{STEPS[step]}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {step === 0 ? (
        <div className="space-y-5">
          <Field label="Full name">
            <input
              className={inputClass}
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Alex Rivera"
              autoComplete="name"
            />
          </Field>
          <Field label="Email">
            <input
              className={inputClass}
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="alex@company.com"
              autoComplete="email"
            />
          </Field>
          <Field label="Company (optional)">
            <input
              className={inputClass}
              value={form.company}
              onChange={(event) => updateField("company", event.target.value)}
              placeholder="Northwind Studio"
              autoComplete="organization"
            />
          </Field>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="space-y-5">
          <Field label="Which service are you interested in?">
            <select
              className={inputClass}
              value={form.service}
              onChange={(event) =>
                updateField("service", event.target.value as ServiceOption)
              }
            >
              {SERVICE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
          <p className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm leading-relaxed text-slate-300">
            The next step asks for your project in your own words. AI will draft a short
            summary and category tags in the background — the same pattern used on
            professional services intake forms.
          </p>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-5">
          <Field
            label="Describe your project or problem"
            hint="Minimum a sentence or two. AI summary runs when you continue."
          >
            <textarea
              className={`${inputClass} min-h-40 resize-y`}
              value={form.problemDescription}
              onChange={(event) =>
                updateField("problemDescription", event.target.value)
              }
              placeholder="We need a client intake form on our site that summarizes requests and lets our team track follow-ups..."
            />
          </Field>
          {analysis ? (
            <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-200">
                AI preview {analysis.mode === "demo" ? "(demo mode)" : ""}
              </p>
              <p className="mt-2 text-sm text-indigo-50">{analysis.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {analysis.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-indigo-400/20 px-3 py-1 text-xs font-medium text-indigo-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {step === 3 ? (
        <div className="space-y-4 text-sm text-slate-300">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <p>
              <span className="font-medium text-slate-100">Contact:</span> {form.name} ·{" "}
              {form.email}
              {form.company ? ` · ${form.company}` : ""}
            </p>
            <p className="mt-2">
              <span className="font-medium text-slate-100">Service:</span> {form.service}
            </p>
            <p className="mt-2 whitespace-pre-wrap">
              <span className="font-medium text-slate-100">Project:</span>{" "}
              {form.problemDescription}
            </p>
          </div>
          {analysis ? (
            <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
              <p className="font-medium text-indigo-100">AI summary</p>
              <p className="mt-2">{analysis.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {analysis.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {error ? (
        <p className="mt-5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </p>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 hover:border-slate-500 disabled:opacity-40"
          onClick={goBack}
          disabled={step === 0 || submitting || analyzing}
        >
          Back
        </button>

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            className="rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-60"
            onClick={() => void goNext()}
            disabled={analyzing}
          >
            {step === 2 && analyzing ? "Analyzing…" : "Continue"}
          </button>
        ) : (
          <button
            type="button"
            className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-emerald-950 hover:bg-emerald-400 disabled:opacity-60"
            onClick={() => void handleSubmit()}
            disabled={submitting}
          >
            {submitting ? "Submitting…" : "Submit request"}
          </button>
        )}
      </div>
    </div>
  );
}
