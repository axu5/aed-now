import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { Resource } from "sst";

const migrationClient = postgres(Resource.Database.connectionString, {
  max: 1,
});
migrate(drizzle(migrationClient), {
  migrationsFolder: "../../migrations",
});

const queryClient = postgres(Resource.Database.connectionString);

export const db = drizzle(queryClient);
