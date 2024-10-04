export const vpc = new sst.aws.Vpc("VPC");
export const rds = new sst.aws.Postgres("Database", { vpc });

// export const api = new sst.aws.Function("MyApi", {
//   url: true,
//   link: [rds],
//   handler: "packages/core/src/drizzle/api.handler",
// });

// export const outputs = {
//   api: api.url,
// };
