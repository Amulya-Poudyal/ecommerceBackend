"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api/admin";
import { productsApi } from "@/lib/api/products";
import { Order, Product, User } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Badge, statusVariant } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { Users, ShoppingBag, Package, TrendingUp } from "lucide-react";
import styles from "./Dashboard.module.css";

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminApi.getAllUsers().catch(() => []),
      adminApi.getAllOrders().catch(() => []),
      productsApi.getAllClient().catch(() => []),
    ]).then(([u, o, p]) => { setUsers(u); setOrders(o); setProducts(p); })
      .finally(() => setLoading(false));
  }, []);

  const revenue = orders
    .filter((o) => o.payment_status === "Paid")
    .reduce((s, o) => s + parseFloat(o.total_amount), 0);

  const stats = [
    { label: "Total Users", value: users.length, icon: Users, color: "var(--badge-info-text)" },
    { label: "Total Orders", value: orders.length, icon: ShoppingBag, color: "var(--color-primary)" },
    { label: "Products", value: products.length, icon: Package, color: "var(--badge-success-text)" },
    { label: "Revenue (Paid)", value: formatPrice(revenue), icon: TrendingUp, color: "var(--badge-success-text)" },
  ];

  const recentOrders = [...orders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 8);

  return (
    <div className={styles.page}>
      <h1 className="page-title">Dashboard</h1>

      {loading ? (
        <div className={styles.statsGrid}>{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height="100px" borderRadius="var(--radius-lg)" />)}</div>
      ) : (
        <div className={styles.statsGrid}>
          {stats.map((s) => (
            <div key={s.label} className={styles.statCard}>
              <div className={styles.statIcon} style={{ color: s.color }}><s.icon size={22} /></div>
              <div>
                <p className={styles.statValue}>{s.value}</p>
                <p className={styles.statLabel}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent Orders</h2>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Order ID</th><th>Date</th><th>Total</th><th>Status</th><th>Payment</th></tr></thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => <tr key={i}><td colSpan={5}><Skeleton height="32px" /></td></tr>)
                : recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td>#{o.id}</td>
                    <td>{new Date(o.created_at).toLocaleDateString()}</td>
                    <td>{formatPrice(o.total_amount)}</td>
                    <td><Badge variant={statusVariant(o.status)}>{o.status}</Badge></td>
                    <td><Badge variant={statusVariant(o.payment_status)}>{o.payment_status}</Badge></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
