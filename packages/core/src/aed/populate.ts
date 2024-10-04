import { readFileSync } from "fs";
import { db } from "../drizzle/index";
import { aed, AEDData, AEDDataSchema } from "./aed.sql";

async function main() {
  const file = readFileSync("");
  const data = JSON.parse(file.toString());
  const res: AEDData[] = new Array(data.length);
  let successes = 0;
  let errors = 0;
  for (const dataPoint of data) {
    const result = AEDDataSchema.safeParse(dataPoint);
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
