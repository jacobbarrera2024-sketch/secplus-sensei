import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/AdminDashboard";
import { isSupabaseConfigured } from "@/lib/env";
import { createServerSupabaseClient, getSessionUser } from "@/lib/supabase/server";
import type { Lead } from "@/lib/types";

async function loadInitialLeads(): Promise<{ leads: Lead[]; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { leads: [], error: null };
  }

  const user = await getSessionUser();
  if (!user) {
    return { leads: [], error: null };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return { leads: [], error: error.message };
  }

  return { leads: (data ?? []) as Lead[], error: null };
}

export default async function AdminPage() {
  const supabaseReady = isSupabaseConfigured();

  if (supabaseReady) {
    const user = await getSessionUser();
    if (!user) {
      redirect("/admin/login?next=/admin");
    }
  }

  const { leads: initialLeads, error: initialLoadError } = supabaseReady
    ? await loadInitialLeads()
    : { leads: [], error: null };

  return (
    <main className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-sm font-bold text-white">LeadDesk Admin</p>
            <p className="text-xs text-slate-400">Owner dashboard</p>
          </div>
          <Link
            href="/"
            className="text-xs font-medium text-slate-300 hover:text-white"
          >
            Public form
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {!supabaseReady ? (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-8 text-sm text-amber-100">
            Add Supabase environment variables and run `supabase/schema.sql` to
            enable the admin dashboard.
          </div>
        ) : (
          <AdminDashboard
            initialLeads={initialLeads}
            initialLoadError={initialLoadError}
          />
        )}
      </div>
    </main>
  );
}
