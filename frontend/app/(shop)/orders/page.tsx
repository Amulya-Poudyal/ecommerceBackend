"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, ChevronRight } from "lucide-react";
import { ordersApi } from "@/lib/api/orders";
import { Order } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Badge, statusVariant } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import styles from "./OrdersPage.module.css";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi.getMyOrders().then(setOrders).catch(() => setOrders([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>My Orders</h1>
      {loading ? (
        <div className={styles.list}>{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height="80px" borderRadius="var(--radius-lg)" />)}</div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <ShoppingBag size={64} />
          <h3>No orders yet</h3>
          <p>Once you place an order, it will appear here.</p>
          <Link href="/products"><Button>Shop Now</Button></Link>
        </div>
      ) : (
        <div className={styles.list}>
          {orders.map((order) => (
            <Link key={order.id} href={`/orders/${order.id}`} className={styles.orderCard}>
              <div className={styles.orderLeft}>
                <p className={styles.orderId}>Order #{order.id}</p>
                <p className={styles.orderDate}>{new Date(order.created_at).toLocaleDateString("en-NP", { day: "numeric", month: "short", year: "numeric" })}</p>
              </div>
              <div className={styles.orderMiddle}>
                <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
                <Badge variant={statusVariant(order.payment_status)}>{order.payment_status}</Badge>
              </div>
              <div className={styles.orderRight}>
                <span className={styles.orderTotal}>{formatPrice(order.total_amount)}</span>
                <ChevronRight size={16} className={styles.arrow} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
