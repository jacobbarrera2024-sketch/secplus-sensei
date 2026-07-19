"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/client";
import { LEAD_STATUSES, type Lead, type LeadStatus } from "@/lib/types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

const statusStyles: Record<LeadStatus, string> = {
  new: "bg-sky-500/15 text-sky-200 border-sky-500/30",
  scheduled: "bg-amber-500/15 text-amber-100 border-amber-500/30",
  archived: "bg-slate-500/15 text-slate-300 border-slate-600/40",
};

export function AdminDashboard({
  initialLeads,
  initialLoadError = null,
}: {
  initialLeads: Lead[];
  initialLoadError?: string | null;
}) {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialLoadError);
  const [filter, setFilter] = useState<LeadStatus | "all">("all");
  const [query, setQuery] = useState("");

  async function loadLeads() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/leads");
      const data = (await response.json()) as {
        leads?: Lead[];
        error?: string;
      };

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error(data.error ?? "Could not load leads");
      }

      setLeads(data.leads ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load leads");
    } finally {
      setLoading(false);
    }
  }

  const filteredLeads = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return leads.filter((lead) => {
      if (filter !== "all" && lead.status !== filter) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const haystack = [
        lead.name,
        lead.email,
        lead.company ?? "",
        lead.service,
        lead.problem_description,
        lead.ai_summary ?? "",
        ...(lead.ai_tags ?? []),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [filter, leads, query]);

  async function updateStatus(id: string, status: LeadStatus) {
    setError(null);

    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = (await response.json()) as { lead?: Lead; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Update failed");
      }

      if (data.lead) {
        setLeads((current) =>
          current.map((lead) => (lead.id === id ? data.lead! : lead)),
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  }

  async function signOut() {
    try {
      const supabase = createBrowserClient();
      await supabase.auth.signOut();
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Incoming requests</h1>
          <p className="mt-1 text-sm text-slate-400">
            Filter, search, and update lead status — New, Scheduled, or Archived.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void loadLeads()}
            className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-200 hover:border-indigo-400"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={() => void signOut()}
            className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-200 hover:border-rose-400"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white placeholder:text-slate-500"
          placeholder="Search name, email, service, tags…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white"
          value={filter}
          onChange={(event) =>
            setFilter(event.target.value as LeadStatus | "all")
          }
        >
          <option value="all">All statuses</option>
          {LEAD_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100"
        >
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-slate-400">Refreshing leads…</p>
      ) : filteredLeads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 p-10 text-center text-sm text-slate-400">
          No leads match this view yet. Submit a test request from the public form.
        </div>
      ) : (
        <>
          <div className="space-y-4 md:hidden">
            {filteredLeads.map((lead) => (
              <article
                key={lead.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4"
              >
                <p className="text-xs text-slate-500">{formatDate(lead.created_at)}</p>
                <p className="mt-2 font-medium text-white">{lead.name}</p>
                <p className="text-sm text-slate-400">{lead.email}</p>
                <p className="mt-2 text-sm text-slate-300">{lead.service}</p>
                <p className="mt-2 text-sm text-slate-400">
                  {lead.ai_summary ?? lead.problem_description.slice(0, 140)}
                </p>
                <label className="mt-4 block">
                  <span className="sr-only">Update status for {lead.name}</span>
                  <select
                    className={`w-full rounded-lg border px-2 py-2 text-xs font-medium capitalize ${statusStyles[lead.status]}`}
                    value={lead.status}
                    onChange={(event) =>
                      void updateStatus(lead.id, event.target.value as LeadStatus)
                    }
                  >
                    {LEAD_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
              </article>
            ))}
          </div>

          <div className="hidden overflow-x-auto rounded-2xl border border-slate-800 md:block">
            <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
              <thead className="bg-slate-900/80 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    Submitted
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Contact
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Service
                  </th>
                  <th scope="col" className="px-4 py-3">
                    AI summary
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950/40">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="align-top">
                    <td className="px-4 py-4 text-slate-300">
                      {formatDate(lead.created_at)}
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-white">{lead.name}</p>
                      <p className="text-slate-400">{lead.email}</p>
                      {lead.company ? (
                        <p className="text-slate-500">{lead.company}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-4 text-slate-300">{lead.service}</td>
                    <td className="px-4 py-4">
                      <p className="max-w-md text-slate-300">
                        {lead.ai_summary ?? lead.problem_description.slice(0, 140)}
                      </p>
                      {lead.ai_tags?.length ? (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {lead.ai_tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-4 py-4">
                      <label>
                        <span className="sr-only">Update status for {lead.name}</span>
                        <select
                          className={`rounded-lg border px-2 py-1.5 text-xs font-medium capitalize ${statusStyles[lead.status]}`}
                          value={lead.status}
                          onChange={(event) =>
                            void updateStatus(lead.id, event.target.value as LeadStatus)
                          }
                        >
                          {LEAD_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
