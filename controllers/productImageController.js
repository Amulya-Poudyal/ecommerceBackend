// controllers/productImages.controller.js
import { db } from '../db/index.ts';
import { product_images } from '../db/schema.ts';
import { eq } from 'drizzle-orm';

// ADD image
export const addImage = async (req, res) => {
    const productId = parseInt(req.params.id);
    const { url } = req.body;

    const image = await db.insert(product_images)
        .values({ product_id: productId, url })
        .returning();

    res.status(201).json({ message: "Image added", image: image[0] });
};

// DELETE image
export const deleteImage = async (req, res) => {
    const imageId = parseInt(req.params.imageId);

    await db.delete(product_images).where(eq(product_images.id, imageId));
    res.json({ message: "Image deleted" });
};
