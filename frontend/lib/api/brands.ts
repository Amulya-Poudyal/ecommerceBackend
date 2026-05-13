import { clientFetch } from "./client";
import { Brand } from "@/types";

export const brandsApi = {
  getAllClient: () => clientFetch<Brand[]>("/brands"),
  create: (name: string, country?: string) =>
    clientFetch<{ message: string; brand: Brand }>("/brands", {
      method: "POST",
      body: JSON.stringify({ name, country }),
    }),
  update: (id: number, name: string) =>
    clientFetch<{ message: string; brand: Brand }>(`/brands/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name }),
    }),
  delete: (id: number) =>
    clientFetch<{ message: string }>(`/brands/${id}`, { method: "DELETE" }),
};
