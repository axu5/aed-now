import { readFileSync } from "fs";
import { db } from "@aed-now/core/drizzle/index";
import { aed } from "@aed-now/core/aed/aed.sql";
import { AEDInsert, AEDInsertSchema } from "@aed-now/core/aed/types";

async function main() {
  const file = readFileSync("./data/de.fi.json");
  const data = JSON.parse(file.toString());
  const res: AEDInsert[] = new Array(data.length);
  let successes = 0;
  let errors = 0;
  for (const dataPoint of data) {
    dataPoint.lat = dataPoint.location.lat;
    dataPoint.lng = dataPoint.location.lng;
    const result = AEDInsertSchema.safeParse(dataPoint);
    if (!result.success) {
      console.log(dataPoint);
      console.error(result.error);
      errors++;
    } else {
      const { data } = result;
      res[successes] = data;
      successes++;
    }
  }

  res.length = successes;

  const maxSize = 128;
  const chunks = Math.ceil(successes / maxSize);
  console.log(`Uploading ${successes} rows in ${chunks} chunks`);

  for (let i = 0; i < chunks; i++) {
    const upperBound = Math.min(i * maxSize + maxSize, successes);
    const subArray = res.slice(i * maxSize, upperBound);
    await db.insert(aed).values(subArray).onConflictDoNothing();
    console.log(`${i + 1}/${chunks} (${subArray.length} rows)`);
  }

  console.log(`Uploaded ${successes} rows with ${errors} errors`);
}

main();
