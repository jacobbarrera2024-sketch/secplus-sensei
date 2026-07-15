const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** ISO currencies that display without fractional digits. */
const ZERO_DECIMAL = new Set(["JPY"]);

export function formatDate(iso: string): string {
  if (!iso) return "—";
  const parts = iso.split("-");
  if (parts.length !== 3) return iso;
  const month = Number(parts[1]) - 1;
  if (month < 0 || month > 11) return iso;
  return `${MONTHS[month]} ${Number(parts[2])}, ${parts[0]}`;
}

export function formatMoney(value: number, currency = "USD"): string {
  const amount = Number.isFinite(value) ? value : 0;
  const code = currency.toUpperCase();
  const fractionDigits = ZERO_DECIMAL.has(code) ? 0 : 2;

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(amount);
  } catch {
    return `$${amount.toFixed(fractionDigits)}`;
  }
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function addDaysISO(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function downloadJson(filename: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
