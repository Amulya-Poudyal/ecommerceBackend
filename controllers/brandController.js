import { db } from '../db/index.ts';
import { brands } from '../db/schema.ts';
import { eq } from 'drizzle-orm';

// GET all brands
export const getBrands = async (req, res) => {
    const result = await db.select().from(brands);
    res.json(result);
};

// CREATE brand (admin)
export const createBrand = async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Brand name required" });
    }

    const brand = await db.insert(brands)
        .values({ name })
        .returning();

    res.status(201).json({ message: "Brand created", brand: brand[0] });
};

// UPDATE brand (admin)
export const updateBrand = async (req, res) => {
    const id = parseInt(req.params.id);
    const { name } = req.body;

    const updated = await db.update(brands)
        .set({ name })
        .where(eq(brands.id, id))
        .returning();

    res.json({ message: "Brand updated", brand: updated[0] });
};

// DELETE brand (admin)
export const deleteBrand = async (req, res) => {
    const id = parseInt(req.params.id);

    await db.delete(brands).where(eq(brands.id, id));
    res.json({ message: "Brand deleted" });
};
