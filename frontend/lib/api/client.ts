import { API_BASE } from "@/lib/constants";
import { ApiError } from "@/types";

// ─── Shared URL builder ───────────────────────────────────────────────────────
export function buildUrl(path: string, params?: Record<string, string | number | undefined>): string {
  const url = new URL(path, API_BASE);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== "" && v !== null) {
        url.searchParams.set(k, String(v));
      }
    }
  }
  return url.toString();
}

// ─── Client-side fetch (browser — cookies sent automatically) ─────────────────
interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | undefined>;
}

export async function clientFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options;

  const res = await fetch(buildUrl(path, params), {
    ...fetchOptions,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
  });

  if (!res.ok) {
    let message = "An error occurred";
    try {
      const body = await res.json();
      message = body.message ?? message;
    } catch {}
    const err: ApiError = { message, status: res.status };
    throw err;
  }

  return res.json() as Promise<T>;
}
