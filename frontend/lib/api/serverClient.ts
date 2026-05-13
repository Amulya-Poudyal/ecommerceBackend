import { cookies } from "next/headers";
import { buildUrl } from "./client";
import { ApiError } from "@/types";

// ─── Server-side fetch (RSC / Server Actions) — forwards cookies ──────────────
interface ServerFetchOptions extends RequestInit {
  params?: Record<string, string | number | undefined>;
}

export async function serverFetch<T>(path: string, options: ServerFetchOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options;
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await fetch(buildUrl(path, params), {
    ...fetchOptions,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
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
