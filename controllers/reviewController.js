import { db } from '../db/index.ts';
import { reviews, orders, order_items } from '../db/schema.ts';
import { eq, and } from 'drizzle-orm';

// ADD review (only if purchased)
export const addReview = async (req, res) => {
    const userId = req.user.id;
    const productId = parseInt(req.params.productId);
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Check if user purchased this product
    const purchased = await db
        .select()
        .from(order_items)
        .innerJoin(orders, eq(order_items.order_id, orders.id))
        .where(
            and(
                eq(orders.user_id, userId),
                eq(order_items.product_id, productId)
            )
        );

    if (purchased.length === 0) {
        return res.status(403).json({ message: "Purchase required to review" });
    }

    // Check if already reviewed
    const existing = await db.select()
        .from(reviews)
        .where(
            and(
                eq(reviews.user_id, userId),
                eq(reviews.product_id, productId)
            )
        );

    if (existing.length > 0) {
        return res.status(409).json({ message: "Product already reviewed" });
    }

    const review = await db.insert(reviews)
        .values({
            user_id: userId,
            product_id: productId,
            order_id: purchased[0].orders.id,
            rating,
            comment
        })
        .returning();

    res.status(201).json({ message: "Review added", review: review[0] });
};

// GET reviews for product (public)
export const getProductReviews = async (req, res) => {
    const productId = parseInt(req.params.productId);

    const result = await db.select().from(reviews)
        .where(eq(reviews.product_id, productId));

    res.json(result);
};

// DELETE review (owner or admin)
export const deleteReview = async (req, res) => {
    const reviewId = parseInt(req.params.id);
    const userId = req.user.id;

    const review = await db.select()
        .from(reviews)
        .where(eq(reviews.id, reviewId));

    if (review.length === 0) {
        return res.status(404).json({ message: "Review not found" });
    }

    if (review[0].user_id !== userId && !req.user.is_admin) {
        return res.status(403).json({ message: "Access denied" });
    }

    await db.delete(reviews).where(eq(reviews.id, reviewId));
    res.json({ message: "Review deleted" });
};
