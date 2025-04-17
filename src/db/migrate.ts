import "dotenv/config";

import { migrate } from "drizzle-orm/libsql/migrator";
import { db } from ".";

console.log("Running migration...");
migrate(db, {
  migrationsFolder: "./drizzle",
})
  .then(() => {
    console.log("Migration is complete");
  })
  .catch((err) => {
    console.error("Migration failed", err);
  });
