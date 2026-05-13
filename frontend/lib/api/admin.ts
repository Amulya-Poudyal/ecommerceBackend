import { clientFetch } from "./client";
import { User, Order } from "@/types";

export const adminApi = {
  // Users
  getAllUsers: () => clientFetch<User[]>("/admin/users"),
  updateUserRole: (userId: number, is_admin: boolean) =>
    clientFetch<{ message: string; user: User }>(`/admin/users/${userId}/role`, {
      method: "PUT",
      body: JSON.stringify({ is_admin }),
    }),

  // Orders
  getAllOrders: () => clientFetch<Order[]>("/admin/orders"),
  updateOrderStatus: (orderId: number, status: string) =>
    clientFetch<{ message: string; order: Order }>(`/admin/orders/${orderId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),

  // Reviews
  deleteReview: (reviewId: number) =>
    clientFetch<{ message: string }>(`/admin/reviews/${reviewId}`, { method: "DELETE" }),
};
