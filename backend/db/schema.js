import {
  pgTable,
  serial,
  varchar,
  integer,
  decimal,
  timestamp,
  text,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ---------------- USERS ----------------
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  is_admin: boolean("is_admin").default(false),
  created_at: timestamp("created_at").defaultNow(),
});

// ---------------- CATEGORIES ----------------
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  description: text("description"),
});

// ---------------- BRANDS ----------------
export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  country: varchar("country", { length: 50 }),
});

// ---------------- PRODUCTS ----------------
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  category_id: integer("category_id").references(() => categories.id),
  brand_id: integer("brand_id").references(() => brands.id),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  discount_price: decimal("discount_price", { precision: 10, scale: 2 }),
  gender: varchar("gender", { length: 10 }),
  material: varchar("material", { length: 50 }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// ---------------- PRODUCT VARIANTS ----------------
export const product_variants = pgTable("product_variants", {
  id: serial("id").primaryKey(),
  product_id: integer("product_id").references(() => products.id),
  size: varchar("size", { length: 10 }),
  color: varchar("color", { length: 20 }),
  quantity: integer("quantity").default(0),
  price: decimal("price", { precision: 10, scale: 2 }), // optional override
});

// ---------------- PRODUCT IMAGES ----------------
export const product_images = pgTable("product_images", {
  id: serial("id").primaryKey(),
  product_id: integer("product_id").references(() => products.id),
  url: varchar("url", { length: 255 }).notNull(),
});

// ---------------- REVIEWS ----------------
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  product_id: integer("product_id").references(() => products.id),
  user_id: integer("user_id").references(() => users.id),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  created_at: timestamp("created_at").defaultNow(),
});

// ---------------- CARTS ----------------
export const carts = pgTable("carts", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// ---------------- CART ITEMS ----------------
export const cart_items = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  cart_id: integer("cart_id").references(() => carts.id),
  product_id: integer("product_id").references(() => products.id),
  variant_id: integer("variant_id").references(() => product_variants.id),
  quantity: integer("quantity").default(1),
});

// ---------------- ORDERS ----------------
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id),
  total_amount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).default("Pending"), // Pending, Shipped, Delivered, Cancelled
  payment_status: varchar("payment_status", { length: 20 }).default("Unpaid"), // Paid, Unpaid, Refunded
  shipping_address: text("shipping_address"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// ---------------- ORDER ITEMS ----------------
export const order_items = pgTable("order_items", {
  id: serial("id").primaryKey(),
  order_id: integer("order_id").references(() => orders.id),
  product_id: integer("product_id").references(() => products.id),
  variant_id: integer("variant_id").references(() => product_variants.id),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

// ---------------- COUPONS ----------------
export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).notNull(),
  discount_percentage: integer("discount_percentage").notNull(),
  valid_from: timestamp("valid_from"),
  valid_to: timestamp("valid_to"),
  usage_limit: integer("usage_limit").default(1),
});

// ---------------- RELATIONS ----------------
export const productRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.category_id],
    references: [categories.id],
  }),
  brand: one(brands, { fields: [products.brand_id], references: [brands.id] }),
  variants: many(product_variants),
  images: many(product_images),
  reviews: many(reviews),
}));

export const productVariantRelations = relations(
  product_variants,
  ({ one }) => ({
    product: one(products, {
      fields: [product_variants.product_id],
      references: [products.id],
    }),
  })
);

export const productImageRelations = relations(product_images, ({ one }) => ({
  product: one(products, {
    fields: [product_images.product_id],
    references: [products.id],
  }),
}));

export const orderRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.user_id], references: [users.id] }),
  items: many(order_items),
}));

export const cartRelations = relations(carts, ({ one, many }) => ({
  user: one(users, { fields: [carts.user_id], references: [users.id] }),
  items: many(cart_items),
}));
