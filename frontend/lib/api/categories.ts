import { clientFetch } from "./client";
import { Category } from "@/types";

export const categoriesApi = {
  getAllClient: () => clientFetch<Category[]>("/categories"),
  create: (name: string, description?: string) =>
    clientFetch<{ message: string; category: Category }>("/categories", {
      method: "POST",
      body: JSON.stringify({ name, description }),
    }),
  update: (id: number, name: string) =>
    clientFetch<{ message: string; category: Category }>(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name }),
    }),
  delete: (id: number) =>
    clientFetch<{ message: string }>(`/categories/${id}`, { method: "DELETE" }),
};
