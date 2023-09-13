export const isValidToken = (token: string) => {
  const decodedJwt = JSON.parse(window.atob(token.split(".")[1]));
  const currentTimestamp = Math.floor(Date.now() / 1000);
  return decodedJwt.exp > currentTimestamp;
};

export const isAuthenticated = () => {
  const accessToken = localStorage.getItem("accessToken");
  return accessToken && isValidToken(accessToken);
};
