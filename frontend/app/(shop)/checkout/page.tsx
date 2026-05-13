"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCart } from "@/lib/hooks/useCart";
import { ordersApi } from "@/lib/api/orders";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import styles from "./CheckoutPage.module.css";

const schema = z.object({
  fullName: z.string().min(2, "Full name required"),
  phone: z.string().min(7, "Valid phone required"),
  street: z.string().min(3, "Street address required"),
  city: z.string().min(2, "City required"),
  state: z.string().min(2, "State/Province required"),
  postalCode: z.string().min(3, "Postal code required"),
  country: z.string().min(2, "Country required"),
});

type FormData = z.infer<typeof schema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, fetchCart } = useCart();
  const { success, error } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { 
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true); 
    fetchCart(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { country: "Nepal" },
  });

  const subtotal = items.reduce((sum, item) => {
    const price = item.variant?.price ?? item.product?.price ?? "0";
    return sum + parseFloat(price) * item.quantity;
  }, 0);

  const onSubmit = async (data: FormData) => {
    if (items.length === 0) { error("Your cart is empty"); return; }
    try {
      const res = await ordersApi.place({ shipping_address: JSON.stringify(data) });
      success("Order placed successfully!");
      router.push(`/orders/${res.order_id}`);
    } catch (err: unknown) {
      const e = err as { message?: string };
      error(e.message ?? "Failed to place order");
    }
  };

  if (!mounted) return null;

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>Checkout</h1>
      <div className={styles.layout}>
        {/* Shipping form */}
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Shipping Information</h2>
            <div className={styles.formGrid}>
              <Input label="Full Name" {...register("fullName")} error={errors.fullName?.message} />
              <Input label="Phone" type="tel" {...register("phone")} error={errors.phone?.message} />
              <div className={styles.fullSpan}>
                <Input label="Street Address" {...register("street")} error={errors.street?.message} />
              </div>
              <Input label="City" {...register("city")} error={errors.city?.message} />
              <Input label="State / Province" {...register("state")} error={errors.state?.message} />
              <Input label="Postal Code" {...register("postalCode")} error={errors.postalCode?.message} />
              <Input label="Country" {...register("country")} error={errors.country?.message} />
            </div>
          </div>

          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Payment Method</h2>
            <div className={styles.paymentOption}>
              <span className={styles.paymentIcon}>💵</span>
              <div>
                <p className={styles.paymentLabel}>Cash on Delivery</p>
                <p className={styles.paymentDesc}>Pay when your order arrives</p>
              </div>
              <span className={styles.paymentCheck}>✓</span>
            </div>
          </div>

          <Button type="submit" fullWidth size="lg" loading={isSubmitting}>
            Place Order — {formatPrice(subtotal)}
          </Button>
        </form>

        {/* Order summary */}
        <div className={styles.summary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>
          <div className={styles.summaryItems}>
            {items.map((item) => {
              const price = item.variant?.price ?? item.product?.price ?? "0";
              return (
                <div key={item.id} className={styles.summaryItem}>
                  <div className={styles.summaryItemInfo}>
                    <p className={styles.summaryItemName}>{item.product?.name ?? `Product #${item.product_id}`}</p>
                    {item.variant && (
                      <p className={styles.summaryItemVariant}>{[item.variant.color, item.variant.size].filter(Boolean).join(" / ")}</p>
                    )}
                  </div>
                  <div className={styles.summaryItemRight}>
                    <span className={styles.summaryQty}>×{item.quantity}</span>
                    <span>{formatPrice(parseFloat(price) * item.quantity)}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={styles.summaryTotals}>
            <div className={styles.summaryRow}><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className={styles.summaryRow}><span>Shipping</span><span className={styles.free}>Free</span></div>
            <div className={[styles.summaryRow, styles.summaryTotal].join(" ")}><span>Total</span><span>{formatPrice(subtotal)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
