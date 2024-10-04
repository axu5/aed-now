import { defineConfig } from "drizzle-kit";
import { Resource } from "sst";

export default defineConfig({
  driver: "aws-data-api",
  dialect: "postgresql",
  dbCredentials: {
    database: Resource.Database.database,
    secretArn: Resource.Database.secretArn,
    resourceArn: Resource.Database.clusterArn,
  },
  // Pick up all our schema files
  schema: ["./src/**/*.sql.ts"],
  out: "./migrations",
});
