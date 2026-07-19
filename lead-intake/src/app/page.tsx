import { SiteHeader } from "@/components/SiteHeader";
import { IntakeForm } from "@/components/IntakeForm";
import { isSupabaseConfigured } from "@/lib/env";

export default function HomePage() {
  const supabaseReady = isSupabaseConfigured();
  const aiLive = Boolean(process.env.OPENAI_API_KEY);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <section>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">
              Portfolio demo · Project #7
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Smart client intake with AI tagging and an admin dashboard
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300">
              LeadDesk mirrors the professional services jobs on Upwork: a multi-step
              public form, background AI summary + category tags, Supabase Postgres
              storage, and a password-protected admin table to track follow-ups.
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                "Next.js App Router + TypeScript",
                "Tailwind CSS UI",
                "Vercel AI SDK (OpenAI)",
                "Supabase Auth + Postgres",
              ].map((item) => (
                <li
                  key={item}
                  className="rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm text-slate-200"
                >
                  {item}
                </li>
              ))}
            </ul>

            {!aiLive ? (
              <p className="mt-4 rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-sm text-slate-300">
                AI tagging runs in <strong>keyword demo mode</strong> until{" "}
                <code className="text-indigo-300">OPENAI_API_KEY</code> is set on the server.
              </p>
            ) : null}

            {!supabaseReady ? (
              <p className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                Supabase env vars are not set in this deployment yet — the form UI and
                AI analyze endpoint still work, but submissions need Supabase to save
                leads. See the README for setup.
              </p>
            ) : null}
          </section>

          <IntakeForm />
        </div>
      </main>
    </>
  );
}
