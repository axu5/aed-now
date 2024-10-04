export const secret = {
  MapboxAccessToken: new sst.Secret("MapboxAccessToken"),
};

export const allSecrets = Object.values(secret);
