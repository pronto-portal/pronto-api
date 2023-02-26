import jwt, { JwtPayload } from "jsonwebtoken";
import { isTokenExpired } from "./istokenExpired";

const isTokenValid = (token: string, secret: string) =>
  new Promise<boolean>((resolve, reject) => {
    jwt.verify(token, secret, function (err, decoded) {
      if (err) reject(false);

      // is token expired
      if (isTokenExpired(decoded as JwtPayload)) reject(false);

      resolve(true);
    });
  });

export const isJWTTokenValid = async (token: string) =>
  await isTokenValid(token, process.env.JWT_SECRET!);
export const isRefreshTokenValid = async (token: string) =>
  await isTokenValid(token, process.env.REFRESH_SECET!);
