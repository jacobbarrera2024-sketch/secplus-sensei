import { QuickQuote } from "@/components/QuickQuote";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-slate-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-teal-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>
      <main id="main-content" className="flex-1">
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
            href="https://github.com/jacobbarrera2024-sketch/secplus-sensei/tree/main/quickquote-next"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source
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
