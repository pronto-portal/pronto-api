import jwt, { VerifyOptions } from "jsonwebtoken";

const isTokenValid = (
  token: string,
  secret: string,
  options?: VerifyOptions
) => {
  try {
    jwt.verify(token, secret, options);
  } catch (e) {
    console.log("isTokenValid Error", e);
    return false;
  }

  return true;
};
export const isJWTTokenValid = (token: string, options?: VerifyOptions) =>
  isTokenValid(token, process.env.JWT_SECRET!, options);

export const isRefreshTokenValid = (token: string, options?: VerifyOptions) =>
  isTokenValid(token, process.env.REFRESH_SECRET!, options);
