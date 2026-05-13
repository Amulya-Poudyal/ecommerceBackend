"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api/admin";
import { Order } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Badge, statusVariant } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { ORDER_STATUSES } from "@/lib/constants";
import { useToast } from "@/components/ui/Toast";
import styles from "./AdminOrders.module.css";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const { success, error } = useToast();

  useEffect(() => {
    adminApi.getAllOrders().then(setOrders).catch(() => []).finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId: number, status: string) => {
    setUpdating(orderId);
    try {
      const res = await adminApi.updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => o.id === orderId ? res.order : o));
      success("Order status updated");
    } catch {
      error("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      <h1 className="page-title">All Orders</h1>
      <p className={styles.count}>{orders.length} total orders</p>
      <div className="table-wrapper" style={{ marginTop: "var(--space-4)" }}>
        <table>
          <thead>
            <tr>
              <th>Order ID</th><th>Date</th><th>Total</th>
              <th>Payment</th><th>Status</th><th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <tr key={i}><td colSpan={6}><Skeleton height="36px" /></td></tr>)
              : orders.map((o) => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>{new Date(o.created_at).toLocaleDateString()}</td>
                  <td>{formatPrice(o.total_amount)}</td>
                  <td><Badge variant={statusVariant(o.payment_status)}>{o.payment_status}</Badge></td>
                  <td><Badge variant={statusVariant(o.status)}>{o.status}</Badge></td>
                  <td>
                    <select
                      className={styles.statusSelect}
                      value={o.status}
                      disabled={updating === o.id}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    >
                      {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
