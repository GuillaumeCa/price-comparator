"server-only";

import "dotenv/config";

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const client = createClient({
  url: process.env.DATABASE_URL!,
});

export const db = drizzle({
  client,
  logger: process.env.NODE_ENV === "development",
});
