import jwt, { JwtPayload } from "jsonwebtoken";
import { isTokenExpired } from "./istokenExpired";

const isTokenValid = (token: string, secret: string) => {
  jwt.verify(token, secret);
  return true;
};
export const isJWTTokenValid = async (token: string) =>
  await isTokenValid(token, process.env.JWT_SECRET!);
export const isRefreshTokenValid = async (token: string) =>
  await isTokenValid(token, process.env.REFRESH_SECRET!);
