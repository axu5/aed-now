export const bucket = new sst.aws.Bucket("InstructionBucket", {
  access: "public",
});

export const outputs = {
  bucket: bucket.name,
};
