import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
  dialect: "postgresql", // Specify the database type
  schema: "./db/schema.js", // Path to your schema file(s)
  out: "./drizzle", // Where migrations would go (required for internal tracking)
  dbCredentials: {
    url: process.env.DATABASE_URL, // Your Postgres connection string
  },
});
