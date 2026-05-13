type ClassValue = string | number | boolean | null | undefined | ClassValue[];

/** Conditionally join class names — no external dependency */
export function cn(...inputs: ClassValue[]): string {
  return inputs
    .flat(10)
    .filter(Boolean)
    .join(" ");
}

/** Format a price string/number into currency */
export function formatPrice(value: string | number, currency = "NPR"): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "—";
  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
}

/** Truncate text with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

/** Get discount percentage */
export function discountPercent(price: string, discountPrice: string): number {
  const p = parseFloat(price);
  const d = parseFloat(discountPrice);
  if (!p || !d || d >= p) return 0;
  return Math.round(((p - d) / p) * 100);
}

/** Effective price — discount_price if set, else price */
export function effectivePrice(price: string, discountPrice: string | null): string {
  if (discountPrice && parseFloat(discountPrice) > 0) return discountPrice;
  return price;
}

/** Build URL search params string from a record */
export function buildQuery(params: Record<string, string | number | undefined>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "" && v !== null) {
      sp.set(k, String(v));
    }
  }
  const q = sp.toString();
  return q ? `?${q}` : "";
}

/** Debounce a function */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/** Parse stringified shipping address safely */
export function parseAddress(raw: string | null): Record<string, string> | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return { raw: raw };
  }
}
