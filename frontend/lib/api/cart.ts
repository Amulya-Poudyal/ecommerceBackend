import { clientFetch } from "./client";
import { CartState } from "@/types";

export const cartApi = {
  get: () => clientFetch<CartState>("/cart"),

  add: (data: { product_id: number; variant_id: number; quantity: number }) =>
    clientFetch<{ message: string; item: object }>("/cart/add", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (itemId: number, quantity: number) =>
    clientFetch<{ message: string; item: object }>(`/cart/item/${itemId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    }),

  remove: (itemId: number) =>
    clientFetch<{ message: string }>(`/cart/item/${itemId}`, { method: "DELETE" }),

  clear: () =>
    clientFetch<{ message: string }>("/cart/clear", { method: "DELETE" }),
};
