import React from "react";
import styles from "./Badge.module.css";

type BadgeVariant = "success" | "warning" | "error" | "info" | "default";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span className={[styles.badge, styles[variant], className].filter(Boolean).join(" ")}>
      {children}
    </span>
  );
}

// Maps order/payment status strings to badge variants
export function statusVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    Pending: "warning",
    Shipped: "info",
    Delivered: "success",
    Cancelled: "error",
    Paid: "success",
    Unpaid: "warning",
    Refunded: "info",
  };
  return map[status] ?? "default";
}
