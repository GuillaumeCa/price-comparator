"server-only";

import "dotenv/config";

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";

const client = createClient({
  url: process.env.DATABASE_URL!,
});

export const db = drizzle({
  client,
  logger: true,
});

await migrate(db, {
  migrationsFolder: "./drizzle",
});
