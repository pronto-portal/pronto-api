import jwt, { VerifyOptions } from "jsonwebtoken";

const isTokenValid = (
  token: string,
  secret: string,
  options?: VerifyOptions
) => {
  jwt.verify(token, secret, options);
  return true;
};
export const isJWTTokenValid = async (token: string, options?: VerifyOptions) =>
  await isTokenValid(token, process.env.JWT_SECRET!, options);
export const isRefreshTokenValid = async (
  token: string,
  options?: VerifyOptions
) => await isTokenValid(token, process.env.REFRESH_SECRET!, options);
