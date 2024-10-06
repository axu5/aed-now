import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { connectionURL } from "../../drizzle.config";

async function handleMigrations() {
  const migrationClient = postgres(connectionURL.toString(), {
    max: 1,
    // ssl: "require",
  });
  await migrate(drizzle(migrationClient), {
    migrationsFolder:
      "/Users/Axu/code/aed-now/packages/core/migrations",
  });
}

handleMigrations();

const queryClient = postgres(connectionURL.toString(), {
  // ssl: "require",
});

export const db = drizzle(queryClient);
