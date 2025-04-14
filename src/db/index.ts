"server-only";

import "dotenv/config";

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const client = createClient({
  url: "file:pricecomparator.db",
});

export const db = drizzle({
  client,
  logger: true,
});
