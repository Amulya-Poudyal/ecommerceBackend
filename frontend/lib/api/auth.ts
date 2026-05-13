import { clientFetch } from "./client";
import { AuthResponse, User } from "@/types";

// All auth calls are client-side (httpOnly cookie sent automatically by browser)
// Server Components that need the current user call /auth/me inline via fetch()
export const authApi = {
  register: (data: { username: string; email: string; password: string }) =>
    clientFetch<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    clientFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: () =>
    clientFetch<{ message: string }>("/auth/logout", { method: "POST" }),

  meClient: () => clientFetch<User>("/auth/me"),
};
