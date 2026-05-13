import { db } from "../db/index.js";
import { categories } from "../db/schema.js";
import { eq } from "drizzle-orm";

// GET all categories
export const getCategories = async (req, res) => {
  const result = await db.select().from(categories);
  res.json(result);
};

// CREATE category (admin)
export const createCategory = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Category name required" });
  }

  const category = await db.insert(categories).values({ name }).returning();

  res.status(201).json({ message: "Category created", category: category[0] });
};

// UPDATE category (admin)
export const updateCategory = async (req, res) => {
  const id = parseInt(req.params.id);
  const { name } = req.body;

  const updated = await db
    .update(categories)
    .set({ name })
    .where(eq(categories.id, id))
    .returning();

  res.json({ message: "Category updated", category: updated[0] });
};

// DELETE category (admin)
export const deleteCategory = async (req, res) => {
  const id = parseInt(req.params.id);

  await db.delete(categories).where(eq(categories.id, id));
  res.json({ message: "Category deleted" });
};
