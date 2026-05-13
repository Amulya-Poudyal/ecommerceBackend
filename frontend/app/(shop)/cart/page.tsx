"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "./CartPage.module.css";

export default function CartPage() {
  const { items, isLoading, fetchCart, removeItem, updateItem, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); fetchCart(); }, [fetchCart]);

  const subtotal = items.reduce((sum, item) => {
    const price = item.variant?.price ?? item.product?.price ?? "0";
    return sum + parseFloat(price) * item.quantity;
  }, 0);

  if (!mounted || isLoading) {
    return (
      <div className={`container ${styles.page}`}>
        <h1 className={styles.title}>Your Cart</h1>
        <div className={styles.layout}>
          <div className={styles.items}>{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} height="100px" />)}</div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={`container ${styles.page}`}>
        <h1 className={styles.title}>Your Cart</h1>
        <div className="empty-state">
          <ShoppingBag size={64} />
          <h3>Your cart is empty</h3>
          <p>Looks like you haven&apos;t added anything yet.</p>
          <Link href="/products"><Button variant="primary">Start Shopping</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>Your Cart <span className={styles.count}>({items.length} items)</span></h1>
      <div className={styles.layout}>
        {/* Items */}
        <div className={styles.items}>
          {items.map((item) => {
            const img = item.product?.images?.[0]?.url;
            const price = item.variant?.price ?? item.product?.price ?? "0";
            const lineTotal = parseFloat(price) * item.quantity;
            return (
              <div key={item.id} className={styles.item}>
                <div className={styles.itemImage}>
                  {img ? <Image src={img} alt={item.product?.name ?? ""} fill sizes="100px" style={{ objectFit: "cover" }} /> : <ShoppingBag size={24} />}
                </div>
                <div className={styles.itemDetails}>
                  <Link href={`/products/${item.product_id}`} className={styles.itemName}>
                    {item.product?.name ?? `Product #${item.product_id}`}
                  </Link>
                  {item.variant && (
                    <p className={styles.itemVariant}>{[item.variant.color, item.variant.size].filter(Boolean).join(" / ")}</p>
                  )}
                  <p className={styles.itemPrice}>{formatPrice(price)} each</p>
                </div>
                <div className={styles.itemActions}>
                  <div className={styles.qty}>
                    <button onClick={() => item.quantity > 1 ? updateItem(item.id, item.quantity - 1) : removeItem(item.id)} disabled={isLoading}><Minus size={13} /></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateItem(item.id, item.quantity + 1)} disabled={isLoading}><Plus size={13} /></button>
                  </div>
                  <p className={styles.lineTotal}>{formatPrice(lineTotal)}</p>
                  <button className={styles.removeBtn} onClick={() => removeItem(item.id)} disabled={isLoading}><Trash2 size={15} /></button>
                </div>
              </div>
            );
          })}
          <div className={styles.clearRow}>
            <Button variant="ghost" size="sm" onClick={() => clearCart()} loading={isLoading}>Clear Cart</Button>
          </div>
        </div>

        {/* Summary */}
        <div className={styles.summary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>
          <div className={styles.summaryRows}>
            <div className={styles.summaryRow}><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className={styles.summaryRow}><span>Shipping</span><span className={styles.free}>Free</span></div>
            <div className={[styles.summaryRow, styles.summaryTotal].join(" ")}><span>Total</span><span>{formatPrice(subtotal)}</span></div>
          </div>
          <Link href="/checkout">
            <Button fullWidth size="lg" rightIcon={<ArrowRight size={16} />}>Proceed to Checkout</Button>
          </Link>
          <Link href="/products" className={styles.continueShopping}>← Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
