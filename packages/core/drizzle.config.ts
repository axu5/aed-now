import { defineConfig } from "drizzle-kit";
import { Resource } from "sst";

export const connectionURL = new URL(
  Resource.Database.connectionString
);

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: connectionURL.toString(),
  },
  // Pick up all our schema files
  schema: ["./src/**/*.sql.ts"],
  out: "./migrations",
});
