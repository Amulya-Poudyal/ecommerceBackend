"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import { ordersApi } from "@/lib/api/orders";
import { OrderWithItems } from "@/types";
import { formatPrice, parseAddress } from "@/lib/utils";
import { Badge, statusVariant } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "./OrderDetail.module.css";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi.getById(id).then(setData).catch(() => setData(null)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className={`container ${styles.page}`}>
      <Skeleton height="32px" width="200px" />
      <div className={styles.grid}>
        <Skeleton height="240px" />
        <Skeleton height="240px" />
      </div>
    </div>
  );

  if (!data) return (
    <div className={`container ${styles.page}`}>
      <div className="empty-state"><Package size={48} /><h3>Order not found</h3><Link href="/orders">← Back to orders</Link></div>
    </div>
  );

  const { order, items } = data;
  const address = parseAddress(order.shipping_address);

  return (
    <div className={`container ${styles.page}`}>
      <Link href="/orders" className={styles.back}><ArrowLeft size={16} /> Back to Orders</Link>

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Order #{order.id}</h1>
          <p className={styles.date}>{new Date(order.created_at).toLocaleDateString("en-NP", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
        <div className={styles.statuses}>
          <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
          <Badge variant={statusVariant(order.payment_status)}>{order.payment_status}</Badge>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Items */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Items Ordered</h2>
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Product</th><th>Variant</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td><Link href={`/products/${item.product_id}`} className={styles.productLink}>Product #{item.product_id}</Link></td>
                    <td>Variant #{item.variant_id}</td>
                    <td>{item.quantity}</td>
                    <td>{formatPrice(item.price)}</td>
                    <td className={styles.bold}>{formatPrice(parseFloat(item.price) * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.orderTotal}>
            <span>Order Total</span>
            <span className={styles.totalAmt}>{formatPrice(order.total_amount)}</span>
          </div>
        </div>

        {/* Shipping */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Shipping Address</h2>
          {address ? (
            <div className={styles.address}>
              {address.fullName && <p className={styles.addrName}>{address.fullName}</p>}
              {address.phone && <p>{address.phone}</p>}
              {address.street && <p>{address.street}</p>}
              {(address.city || address.state) && <p>{[address.city, address.state].filter(Boolean).join(", ")}</p>}
              {address.postalCode && <p>{address.postalCode}</p>}
              {address.country && <p>{address.country}</p>}
              {address.raw && <p>{address.raw}</p>}
            </div>
          ) : (
            <p className="text-muted">No shipping address recorded</p>
          )}

          <div className={styles.paymentMethod}>
            <h2 className={styles.cardTitle}>Payment</h2>
            <p>💵 Cash on Delivery</p>
          </div>
        </div>
      </div>
    </div>
  );
}
