// ─── Users ───────────────────────────────────────────────────────────────────
export interface User {
  id: number;
  username: string;
  email: string;
  is_admin?: boolean;
  created_at?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}

// ─── Categories & Brands ──────────────────────────────────────────────────────
export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Brand {
  id: number;
  name: string;
  country?: string;
}

// ─── Products ─────────────────────────────────────────────────────────────────
export interface ProductVariant {
  id: number;
  product_id: number;
  size: string | null;
  color: string | null;
  quantity: number;
  price: string | null; // decimal comes back as string from Drizzle
}

export interface ProductImage {
  id: number;
  product_id: number;
  url: string;
}

export interface Product {
  id: number;
  name: string;
  category_id: number | null;
  brand_id: number | null;
  description: string | null;
  price: string; // decimal → string
  discount_price: string | null;
  gender: string | null;
  material: string | null;
  created_at: string;
  updated_at: string;
  variants: ProductVariant[];
  images: ProductImage[];
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  gender?: string;
  minPrice?: string;
  maxPrice?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// ─── Reviews ──────────────────────────────────────────────────────────────────
export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  comment: string | null;
  created_at: string;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  variant_id: number;
  quantity: number;
  // enriched client-side
  product?: Product;
  variant?: ProductVariant;
}

export interface Cart {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface CartState {
  cart: Cart | null;
  items: CartItem[];
}

// ─── Orders ───────────────────────────────────────────────────────────────────
export type OrderStatus = "Pending" | "Shipped" | "Delivered" | "Cancelled";
export type PaymentStatus = "Paid" | "Unpaid" | "Refunded";

export interface Order {
  id: number;
  user_id: number;
  total_amount: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  shipping_address: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  variant_id: number;
  quantity: number;
  price: string;
}

export interface OrderWithItems {
  order: Order;
  items: OrderItem[];
}

// ─── Wishlist (client-only) ───────────────────────────────────────────────────
export interface WishlistItem {
  product_id: number;
  added_at: string;
}

// ─── API Errors ───────────────────────────────────────────────────────────────
export interface ApiError {
  message: string;
  status?: number;
}

// ─── Checkout ─────────────────────────────────────────────────────────────────
export interface ShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}
