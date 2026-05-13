import { clientFetch } from "./client";
import { Product, ProductFilters } from "@/types";

export const productsApi = {
  getAllClient: (filters?: ProductFilters) =>
    clientFetch<Product[]>("/products", {
      params: filters as Record<string, string | number | undefined>,
    }),

  create: (data: Partial<Product>) =>
    clientFetch<{ message: string; product: Product }>("/products", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: Partial<Product>) =>
    clientFetch<{ message: string; product: Product }>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    clientFetch<{ message: string }>(`/products/${id}`, { method: "DELETE" }),

  addVariant: (productId: number, data: { size?: string; color?: string; quantity: number; price?: string }) =>
    clientFetch(`/products/${productId}/variants`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateVariant: (productId: number, variantId: number, data: object) =>
    clientFetch(`/products/${productId}/variants/${variantId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteVariant: (productId: number, variantId: number) =>
    clientFetch(`/products/${productId}/variants/${variantId}`, { method: "DELETE" }),

  addImage: (productId: number, url: string) =>
    clientFetch(`/products/${productId}/images`, {
      method: "POST",
      body: JSON.stringify({ url }),
    }),

  deleteImage: (productId: number, imageId: number) =>
    clientFetch(`/products/${productId}/images/${imageId}`, { method: "DELETE" }),
};
