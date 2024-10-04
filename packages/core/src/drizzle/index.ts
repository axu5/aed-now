import { Resource } from "sst";
import { drizzle } from "drizzle-orm/aws-data-api/pg";
import { RDSDataClient } from "@aws-sdk/client-rds-data";

const client = new RDSDataClient({
  region: "eu-central-1",
});

export const db = drizzle(client, {
  database: Resource.Database.database,
  secretArn: Resource.Database.secretArn,
  resourceArn: Resource.Database.clusterArn,
});
