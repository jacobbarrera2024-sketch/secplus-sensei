import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";
import { isSupabaseConfigured } from "@/lib/env";

export default function AdminLoginPage() {
  const supabaseReady = isSupabaseConfigured();

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
      <Link href="/" className="mb-8 text-sm text-slate-400 hover:text-white">
        ← Back to intake form
      </Link>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8">
        <h1 className="text-2xl font-bold text-white">Admin sign in</h1>
        <p className="mt-2 text-sm text-slate-400">
          Access the lead dashboard. Create an admin user in your Supabase project
          first.
        </p>

        {!supabaseReady ? (
          <p className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            Configure `NEXT_PUBLIC_SUPABASE_URL` and
            `NEXT_PUBLIC_SUPABASE_ANON_KEY` before signing in.
          </p>
        ) : (
          <div className="mt-6">
            <Suspense fallback={<p className="text-sm text-slate-400">Loading…</p>}>
              <LoginForm />
            </Suspense>
          </div>
        )}
      </div>
    </main>
  );
}
