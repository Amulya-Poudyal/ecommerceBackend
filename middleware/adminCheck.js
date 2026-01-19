import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";

const adminCheck = async (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const [user] = await db.select().from(users).where(eq(users.id, userId));

    if (user?.is_admin) {
        next();
    } else {
        res.status(403).json({ message: "Forbidden: Admin access required" });
    }
};

export default adminCheck;
