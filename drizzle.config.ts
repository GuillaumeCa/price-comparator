import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "sqlite",
  strict: true,
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
