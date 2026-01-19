import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

// REGISTER
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if user exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (existingUser.length > 0) {
    return res.status(409).json({ message: "User already exists" });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = await db
    .insert(users)
    .values({ username, email, password: hashedPassword })
    .returning();

  // Create JWT
  const token = jwt.sign(
    { id: newUser[0].id, username, email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false, // set true in production (HTTPS)
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res
    .status(201)
    .json({
      message: "Registered & logged in",
      user: { id: newUser[0].id, username, email },
    });
};

// LOGIN
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await db.select().from(users).where(eq(users.email, email));

  if (user.length === 0) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user[0].password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user[0].id, username: user[0].username, email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    message: "Logged in successfully",
    user: { id: user[0].id, username: user[0].username, email },
  });
};

// LOGOUT
export const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

// GET CURRENT USER
export const getCurrentUser = async (req, res) => {
  const userId = req.user.id;

  const user = await db.select().from(users).where(eq(users.id, userId));

  if (user.length === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    id: user[0].id,
    username: user[0].username,
    email: user[0].email,
  });
};
