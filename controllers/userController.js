import { db } from '../db/index.ts';
import { users } from '../db/schema.ts';
import { eq } from 'drizzle-orm';

// GET single user
export const getUser = async (req, res) => {
    const userId = parseInt(req.params.id);

    // Only admin or owner can access
    if (req.user.id !== userId && !req.user.is_admin) {
        return res.status(403).json({ message: "Access denied" });
    }

    const user = await db.select().from(users).where(eq(users.id, userId));

    if (user.length === 0) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json({ id: user[0].id, username: user[0].username, email: user[0].email, is_admin: user[0].is_admin });
};

// UPDATE user info
export const updateUser = async (req, res) => {
    const userId = parseInt(req.params.id);
    const { username, email, password } = req.body;

    // Only admin or owner can update
    if (req.user.id !== userId && !req.user.is_admin) {
        return res.status(403).json({ message: "Access denied" });
    }

    const updated = await db.update(users)
        .set({ username, email, password })
        .where(eq(users.id, userId))
        .returning();

    res.json({ message: "User updated", user: updated[0] });
};

// GET all users (admin only)
export const getAllUsers = async (req, res) => {
    const allUsers = await db.select().from(users);
    res.json(allUsers.map(u => ({
        id: u.id,
        username: u.username,
        email: u.email,
        is_admin: u.is_admin
    })));
};
