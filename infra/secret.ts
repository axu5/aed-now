export const secret = {
  MapboxAccessToken: new sst.Secret("MapboxAccessToken"),
  DBIPAddress: new sst.Secret("DBIPAddress"),
  DBUserName: new sst.Secret("DBUserName"),
  DBPassword: new sst.Secret("DBPassword"),
  DBPort: new sst.Secret("DBPort"),
  DBName: new sst.Secret("DBName"),
};

export const allSecrets = Object.values(secret);
