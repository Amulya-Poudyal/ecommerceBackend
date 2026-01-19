import { db } from "../db/index.js";
import {
  orders,
  order_items,
  carts,
  cart_items,
  product_variants,
} from "../db/schema.js";
import { eq, and } from "drizzle-orm";

// PLACE ORDER (Checkout)
export const placeOrder = async (req, res) => {
  const userId = req.user.id;

  // Get cart
  const cart = await db.select().from(carts).where(eq(carts.user_id, userId));

  if (cart.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const cartItems = await db
    .select()
    .from(cart_items)
    .where(eq(cart_items.cart_id, cart[0].id));

  if (cartItems.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  // Calculate total
  let total = 0;

  for (const item of cartItems) {
    const variant = await db
      .select()
      .from(product_variants)
      .where(eq(product_variants.id, item.variant_id));

    total += variant[0].price * item.quantity;
  }

  // Create order
  const order = await db
    .insert(orders)
    .values({
      user_id: userId,
      total_amount: total,
      status: "pending",
    })
    .returning();

  // Create order items
  for (const item of cartItems) {
    const variant = await db
      .select()
      .from(product_variants)
      .where(eq(product_variants.id, item.variant_id));

    await db.insert(order_items).values({
      order_id: order[0].id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      price: variant[0].price,
      quantity: item.quantity,
    });
  }

  // Clear cart
  await db.delete(cart_items).where(eq(cart_items.cart_id, cart[0].id));

  res.status(201).json({
    message: "Order placed successfully",
    order_id: order[0].id,
  });
};

// GET user's orders
export const getMyOrders = async (req, res) => {
  const userId = req.user.id;

  const result = await db
    .select()
    .from(orders)
    .where(eq(orders.user_id, userId));

  res.json(result);
};

// GET order details
export const getOrderById = async (req, res) => {
  const userId = req.user.id;
  const orderId = parseInt(req.params.id);

  if (isNaN(orderId)) {
    return res.status(400).json({ message: "Invalid order ID" });
  }

  const order = await db.select().from(orders).where(eq(orders.id, orderId));

  if (order.length === 0) {
    return res.status(404).json({ message: "Order not found" });
  }

  // User can only see their order (unless admin)
  if (order[0].user_id !== userId && !req.user.is_admin) {
    return res.status(403).json({ message: "Access denied" });
  }

  const items = await db
    .select()
    .from(order_items)
    .where(eq(order_items.order_id, orderId));

  res.json({ order: order[0], items });
};

// ADMIN: update order status
export const updateOrderStatus = async (req, res) => {
  const orderId = parseInt(req.params.id);

  if (isNaN(orderId)) {
    return res.status(400).json({ message: "Invalid order ID" });
  }
  const { status } = req.body;

  const updated = await db
    .update(orders)
    .set({ status })
    .where(eq(orders.id, orderId))
    .returning();

  res.json({ message: "Order status updated", order: updated[0] });
};

// ADMIN: get all orders
export const getAllOrders = async (req, res) => {
  const result = await db.select().from(orders);
  res.json(result);
};
