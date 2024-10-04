// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Map } from "@/components/Map";
import { aed } from "@aed-now/core/aed/aed.sql";
import { db } from "@aed-now/core/drizzle/index";
import { Resource } from "sst";

export default async function Home() {
  const result = await db.select().from(aed).limit(512);

  return (
    <main>
      <Map
        mapboxAccessToken={Resource.MapboxAccessToken.value}
        // @ts-ignore
        points={result}
      />
    </main>
  );
}
