import { secret } from "./secret";

// The database is hosted on an OVH VPS
// It's using the latest version of postgresql
const dbDetails = {
  password: secret.DBPassword.value,
  username: secret.DBUserName.value,
  host: secret.DBIPAddress.value,
  port: secret.DBPort.value,
  name: secret.DBName.value,
};

const connectionString = $interpolate`postgres://${dbDetails.username}:${dbDetails.password}@${dbDetails.host}:${dbDetails.port}/${dbDetails.name}`;

export const db = new sst.Linkable("Database", {
  properties: {
    connectionString,
  },
});

export const outputs = {
  db: dbDetails.host,
};
