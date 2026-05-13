"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "@/lib/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import styles from "./CartDrawer.module.css";

export function CartDrawer() {
  const { items, isOpen, isLoading, closeCart, removeItem, updateItem, totalItems } = useCart();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const subtotal = items.reduce((sum, item) => {
    const price = item.variant?.price ?? item.product?.price ?? "0";
    return sum + parseFloat(price) * item.quantity;
  }, 0);

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={closeCart} />
      <aside className={styles.drawer}>
        <div className={styles.header}>
          <div className={styles.title}>
            <ShoppingBag size={18} />
            <span>Cart ({totalItems})</span>
          </div>
          <button className={styles.close} onClick={closeCart}><X size={18} /></button>
        </div>

        <div className={styles.body}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <ShoppingBag size={48} />
              <p>Your cart is empty</p>
              <Button variant="outline" onClick={closeCart} size="sm">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <ul className={styles.items}>
              {items.map((item) => {
                const img = item.product?.images?.[0]?.url;
                const price = item.variant?.price ?? item.product?.price ?? "0";
                return (
                  <li key={item.id} className={styles.item}>
                    <div className={styles.itemImage}>
                      {img ? (
                        <Image src={img} alt={item.product?.name ?? "Product"} fill sizes="72px" style={{ objectFit: "cover" }} />
                      ) : (
                        <ShoppingBag size={20} />
                      )}
                    </div>
                    <div className={styles.itemInfo}>
                      <p className={styles.itemName}>{item.product?.name ?? `Product #${item.product_id}`}</p>
                      {item.variant && (
                        <p className={styles.itemVariant}>
                          {[item.variant.color, item.variant.size].filter(Boolean).join(" / ")}
                        </p>
                      )}
                      <p className={styles.itemPrice}>{formatPrice(price)}</p>
                      <div className={styles.qty}>
                        <button
                          onClick={() => item.quantity > 1 ? updateItem(item.id, item.quantity - 1) : removeItem(item.id)}
                          disabled={isLoading}
                        ><Minus size={12} /></button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateItem(item.id, item.quantity + 1)} disabled={isLoading}>
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                    <button className={styles.remove} onClick={() => removeItem(item.id)} disabled={isLoading}>
                      <Trash2 size={14} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.subtotal}>
              <span>Subtotal</span>
              <span className={styles.subtotalAmt}>{formatPrice(subtotal)}</span>
            </div>
            <p className={styles.shipping}>Shipping calculated at checkout</p>
            <Link href="/checkout" onClick={closeCart}>
              <Button fullWidth size="lg">Proceed to Checkout</Button>
            </Link>
            <Link href="/cart" onClick={closeCart}>
              <Button fullWidth variant="ghost" size="sm">View Full Cart</Button>
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
