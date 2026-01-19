import { db } from "../db/index.js";
import { carts, cart_items, product_variants } from "../db/schema.js";
import { eq, and } from "drizzle-orm";

// Get or create cart
const getOrCreateCart = async (userId) => {
  const existing = await db
    .select()
    .from(carts)
    .where(eq(carts.user_id, userId));

  if (existing.length > 0) {
    return existing[0];
  }

  const cart = await db.insert(carts).values({ user_id: userId }).returning();

  return cart[0];
};

// GET cart
export const getCart = async (req, res) => {
  const userId = req.user.id;

  const cart = await getOrCreateCart(userId);

  const items = await db
    .select()
    .from(cart_items)
    .where(eq(cart_items.cart_id, cart.id));

  res.json({ cart, items });
};

// ADD item to cart
export const addToCart = async (req, res) => {
  const userId = req.user.id;
  const { product_id, variant_id, quantity } = req.body;

  if (!product_id || !variant_id || !quantity) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const cart = await getOrCreateCart(userId);

  // Check if item already exists
  const existingItem = await db
    .select()
    .from(cart_items)
    .where(
      and(
        eq(cart_items.cart_id, cart.id),
        eq(cart_items.variant_id, variant_id)
      )
    );

  if (existingItem.length > 0) {
    const updated = await db
      .update(cart_items)
      .set({ quantity: existingItem[0].quantity + quantity })
      .where(eq(cart_items.id, existingItem[0].id))
      .returning();

    return res.json({ message: "Cart updated", item: updated[0] });
  }

  const item = await db
    .insert(cart_items)
    .values({
      cart_id: cart.id,
      product_id,
      variant_id,
      quantity,
    })
    .returning();

  res.status(201).json({ message: "Item added to cart", item: item[0] });
};

// UPDATE cart item quantity
export const updateCartItem = async (req, res) => {
  const userId = req.user.id;
  const itemId = parseInt(req.params.itemId);
  const { quantity } = req.body;

  const cart = await getOrCreateCart(userId);

  const updated = await db
    .update(cart_items)
    .set({ quantity })
    .where(and(eq(cart_items.id, itemId), eq(cart_items.cart_id, cart.id)))
    .returning();

  res.json({ message: "Cart item updated", item: updated[0] });
};

// REMOVE item from cart
export const removeCartItem = async (req, res) => {
  const userId = req.user.id;
  const itemId = parseInt(req.params.itemId);

  const cart = await getOrCreateCart(userId);

  await db
    .delete(cart_items)
    .where(and(eq(cart_items.id, itemId), eq(cart_items.cart_id, cart.id)));

  res.json({ message: "Item removed from cart" });
};

// CLEAR cart
export const clearCart = async (req, res) => {
  const userId = req.user.id;

  const cart = await getOrCreateCart(userId);

  await db.delete(cart_items).where(eq(cart_items.cart_id, cart.id));

  res.json({ message: "Cart cleared" });
};
