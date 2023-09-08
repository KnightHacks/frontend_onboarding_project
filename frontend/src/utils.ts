export const isValidAccessToken = (jwt: string) => {
  const decodedJwt = JSON.parse(window.atob(jwt.split(".")[1]));
  const currentTimestamp = Math.floor(Date.now() / 1000);
  return decodedJwt.exp > currentTimestamp;
};
