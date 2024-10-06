import { Map } from "@/components/Map";
import { aed } from "@aed-now/core/aed/aed.sql";
import { db } from "@aed-now/core/drizzle/index";
import { eq, desc } from "drizzle-orm";
import { Resource } from "sst";

export default async function Home() {
  const result = await db
    .select()
    .from(aed)
    .where(eq(aed.city, "Mikkeli"))
    // sort from back to front (for rendering purposes)
    .orderBy(desc(aed.lat))
    .limit(128);

  return (
    <main>
      <Map
        mapboxAccessToken={Resource.MapboxAccessToken.value}
        points={result}
      />
    </main>
  );
}
