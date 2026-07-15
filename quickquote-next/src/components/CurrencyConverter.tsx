"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ExchangeResponse } from "@/lib/types";
import { CURRENCIES } from "@/lib/currencies";
import { formatMoney } from "@/lib/format";

type Status = "loading" | "ok" | "error";

async function fetchExchangeRates(
  base: string,
  signal?: AbortSignal,
): Promise<ExchangeResponse> {
  const res = await fetch(`/api/exchange?base=${encodeURIComponent(base)}`, { signal });
  const json = (await res.json()) as ExchangeResponse & { error?: string };
  if (!res.ok) {
    throw new Error(json.error || `Request failed (${res.status})`);
  }
  return json;
}

export function CurrencyConverter({ base, total }: { base: string; total: number }) {
  const [status, setStatus] = useState<Status>("loading");
  const [data, setData] = useState<ExchangeResponse | null>(null);
  const [error, setError] = useState("");
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const controller = new AbortController();

    void fetchExchangeRates(base, controller.signal)
      .then((payload) => {
        if (!mounted.current) return;
        setData(payload);
        setStatus("ok");
        setError("");
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted || !mounted.current) return;
        setError(err instanceof Error ? err.message : "Something went wrong.");
        setStatus("error");
      });

    return () => {
      mounted.current = false;
      controller.abort();
    };
  }, [base]);

  const refresh = useCallback(() => {
    setStatus("loading");
    setError("");
    void fetchExchangeRates(base)
      .then((payload) => {
        setData(payload);
        setStatus("ok");
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Something went wrong.");
        setStatus("error");
      });
  }, [base]);

  const others = CURRENCIES.filter((c) => c.code !== base);

  return (
    <div className="space-y-3">
      <p className="text-xs leading-relaxed text-slate-500">
        Live rates via a Next.js API route (Node.js) that proxies the Frankfurter
        exchange-rate API — keys stay server-side, client calls{" "}
        <code className="rounded bg-slate-100 px-1 py-0.5 text-[11px]">/api/exchange</code>.
      </p>

      {status === "loading" && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" aria-busy="true" aria-label="Loading rates">
          {others.slice(0, 6).map((c) => (
            <div
              key={c.code}
              className="h-14 animate-pulse rounded-lg border border-slate-200 bg-slate-100 motion-reduce:animate-none"
            />
          ))}
        </div>
      )}

      {status === "error" && (
        <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900" role="alert">
          <p>{error}</p>
          <button
            type="button"
            onClick={refresh}
            className="mt-2 rounded-md bg-amber-600 px-3 py-1 text-xs font-semibold text-white hover:bg-amber-700"
          >
            Retry
          </button>
        </div>
      )}

      {status === "ok" && data && (
        <>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {others.map((c) => {
              const rate = data.rates[c.code];
              if (typeof rate !== "number") return null;
              return (
                <div
                  key={c.code}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                >
                  <div className="text-xs font-semibold text-slate-500">{c.code}</div>
                  <div className="text-sm font-bold text-slate-800">
                    {formatMoney(total * rate, c.code)}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-slate-400">Rates as of {data.date}</span>
            <button
              type="button"
              onClick={refresh}
              className="text-xs font-semibold text-teal-700 hover:underline"
            >
              Refresh
            </button>
          </div>
        </>
      )}
    </div>
  );
}
