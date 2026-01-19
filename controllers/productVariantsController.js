// controllers/productVariants.controller.js
import { db } from "../db/index.js";
import { product_variants } from "../db/schema.js";
import { eq } from "drizzle-orm";

// ADD variant
export const addVariant = async (req, res) => {
  const productId = parseInt(req.params.id);
  const { size, color, quantity, price } = req.body;

  const variant = await db
    .insert(product_variants)
    .values({ product_id: productId, size, color, quantity, price })
    .returning();

  res.status(201).json({ message: "Variant added", variant: variant[0] });
};

// UPDATE variant
export const updateVariant = async (req, res) => {
  const variantId = parseInt(req.params.variantId);
  const { size, color, quantity, price } = req.body;

  const updated = await db
    .update(product_variants)
    .set({ size, color, quantity, price })
    .where(eq(product_variants.id, variantId))
    .returning();

  res.json({ message: "Variant updated", variant: updated[0] });
};

// DELETE variant
export const deleteVariant = async (req, res) => {
  const variantId = parseInt(req.params.variantId);

  await db.delete(product_variants).where(eq(product_variants.id, variantId));
  res.json({ message: "Variant deleted" });
};
