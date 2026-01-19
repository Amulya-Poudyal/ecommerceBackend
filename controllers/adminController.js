import { db } from '../db/index.js';
import { users, orders, reviews } from '../db/schema.js';
import { eq } from 'drizzle-orm';

// GET all users
export const getAllUsers = async (req, res) => {
    const result = await db.select().from(users);
    res.json(result);
};

// UPDATE user role
export const updateUserRole = async (req, res) => {
    const userId = parseInt(req.params.id);
    const { is_admin } = req.body;

    const updated = await db.update(users)
        .set({ is_admin })
        .where(eq(users.id, userId))
        .returning();

    res.json({ message: "User role updated", user: updated[0] });
};

// GET all orders
export const getAllOrders = async (req, res) => {
    const result = await db.select().from(orders);
    res.json(result);
};

// UPDATE order status
export const updateOrderStatus = async (req, res) => {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;

    const updated = await db.update(orders)
        .set({ status })
        .where(eq(orders.id, orderId))
        .returning();

    res.json({ message: "Order status updated", order: updated[0] });
};

// DELETE review (admin)
export const deleteReviewAdmin = async (req, res) => {
    const reviewId = parseInt(req.params.id);

    await db.delete(reviews).where(eq(reviews.id, reviewId));
    res.json({ message: "Review deleted by admin" });
};
