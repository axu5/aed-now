import { rds } from "./db";
import { secret } from "./secret";
import { bucket } from "./storage";

export const www = new sst.aws.Nextjs("AEDNowSite", {
  link: [bucket, rds, secret.MapboxAccessToken],
  path: "packages/www",
});

export const outputs = {
  site: www.url,
};
