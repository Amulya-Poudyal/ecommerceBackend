export const ORDER_STATUSES = ["Pending", "Shipped", "Delivered", "Cancelled"] as const;
export const PAYMENT_STATUSES = ["Paid", "Unpaid", "Refunded"] as const;
export const GENDER_OPTIONS = ["Men", "Women", "Unisex", "Kids"] as const;

export const ORDER_STATUS_COLORS: Record<string, string> = {
  Pending: "var(--badge-warning)",
  Shipped: "var(--badge-info)",
  Delivered: "var(--badge-success)",
  Cancelled: "var(--badge-error)",
};

export const PAYMENT_STATUS_COLORS: Record<string, string> = {
  Paid: "var(--badge-success)",
  Unpaid: "var(--badge-warning)",
  Refunded: "var(--badge-info)",
};

export const PRODUCTS_PER_PAGE = 12;
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "KritimStore";
export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
