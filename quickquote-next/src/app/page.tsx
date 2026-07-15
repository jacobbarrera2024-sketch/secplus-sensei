import { QuickQuote } from "@/components/QuickQuote";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-slate-50">
      <main className="flex-1">
        <QuickQuote />
      </main>
      <footer className="border-t border-slate-200 bg-white px-4 py-5 text-center text-sm text-slate-500 print:hidden">
        <p>
          Built by <strong className="text-slate-700">Jacob Barrera</strong> ·{" "}
          <a
            className="font-medium text-teal-700 hover:underline"
            href="https://jacobbarrera2024-sketch.github.io/"
          >
            Portfolio
          </a>{" "}
          ·{" "}
          <a
            className="font-medium text-teal-700 hover:underline"
            href="https://github.com/jacobbarrera2024-sketch"
          >
            GitHub
          </a>
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Next.js · React · TypeScript · Tailwind CSS · Node.js API route. Drafts save in this
          browser only — use Print → Save as PDF for a shareable file.
        </p>
      </footer>
    </div>
  );
}
