import { JwtPayload, decode, sign } from "jsonwebtoken";
import { isJWTTokenValid, isRefreshTokenValid } from "./isTokenValid";
import { Context } from "../../graphql/schema/context";
import { decryptRefreshToken } from "./decryptRefreshToken";
import { parseAuthHeader } from "./parseAuthHeader";
import { tokenExpireTime } from "../constants/auth";

export const isAuthorized = async ({ res, req, prisma, user }: Context) => {
  const token: string = parseAuthHeader(req.headers.authorization);

  if (!token) return false;

  // console.log("Token found, decoding token");
  const decodedToken = decode(token) as JwtPayload;

  // check if token is expired, if it is expired check to see if the user has a valid and unexpired refresh token
  // console.log("Validating token");
  const isTokenValid = await isJWTTokenValid(token, {
    ignoreExpiration: false,
  });

  if (!isTokenValid) {
    // console.log("Invalid token");

    const refreshTokenRecord = await prisma.refreshToken.findUnique({
      where: {
        userId: user.id,
      },
    });

    const refreshToken: string | undefined = refreshTokenRecord?.token;
    // check if refresh token is expired
    if (!refreshToken) {
      // console.log("No refresh token found, token cannot be refreshed");
      return false;
    }

    // console.log("Decrypting refresh token");
    const decryptedRefreshToken = decryptRefreshToken(refreshToken);

    // console.log("Validating refresh token");
    const isRefreshValid = isRefreshTokenValid(decryptedRefreshToken, {
      ignoreExpiration: false,
    });

    if (!isRefreshValid) {
      // console.log("Invalid refresh token");
      await prisma.refreshToken.delete({
        where: {
          id: refreshTokenRecord!.id,
        },
      });

      return false;
    }

    const foundUser = await prisma.user.findUnique({
      where: {
        id: decodedToken.id,
      },
    });

    if (foundUser) {
      // console.log("Refreshing token");
      const newToken = sign(foundUser, process.env.JWT_SECRET!, {
        expiresIn: tokenExpireTime,
      });

      res.cookie("x-access-token", newToken);
    }
  }
  return true;
};
