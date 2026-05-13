import { clientFetch } from "./client";
import { Review } from "@/types";

export const reviewsApi = {
  add: (productId: number, data: { rating: number; comment?: string }) =>
    clientFetch<{ message: string; review: Review }>(`/reviews/${productId}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  delete: (reviewId: number) =>
    clientFetch<{ message: string }>(`/reviews/${reviewId}`, { method: "DELETE" }),
};
