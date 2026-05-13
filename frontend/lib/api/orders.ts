import { clientFetch } from "./client";
import { Order, OrderWithItems } from "@/types";

export const ordersApi = {
  place: (data: { shipping_address: string }) =>
    clientFetch<{ message: string; order_id: number }>("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMyOrders: () => clientFetch<Order[]>("/orders/my"),

  getById: (id: number | string) =>
    clientFetch<OrderWithItems>(`/orders/${id}`),
};
