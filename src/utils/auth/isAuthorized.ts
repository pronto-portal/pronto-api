import { JwtPayload, decode, sign } from "jsonwebtoken";
import { isJWTTokenValid, isRefreshTokenValid } from "./isTokenValid";
import { Context } from "../../graphql/schema/context";
import { decryptRefreshToken } from "./decryptRefreshToken";
import { parseAuthHeader } from "./parseAuthHeader";
import { tokenExpireTime } from "../constants/auth";
import { enforceUserRole } from "./enforceUserRole";
import { RoleNames } from "../../types";

export const isAuthorized = async (
  { res, req, prisma, user }: Context,
  roleName: RoleNames = "basic"
) => {
  const token: string = parseAuthHeader(req.headers.authorization);

  if (!token) return false;

  // console.log("Token found, decoding token");
  const decodedToken = decode(token) as JwtPayload;

  // check if token is expired, if it is expired check to see if the user has a valid and unexpired refresh token
  // console.log("Validating token");
  const isTokenValid = await isJWTTokenValid(token, {
    ignoreExpiration: false,
  });

  // console.log("TOKEN VALID", isTokenValid);

  const foundUser = await prisma.user.findUnique({
    where: {
      id: decodedToken.id,
    },
  });

  // console.log("VALIDATING ROLES");
  const userHasValidRoles = enforceUserRole(foundUser!, roleName);
  // console.log("VALIDATED ROLES", userHasValidRoles);
  if (!userHasValidRoles) {
    // console.log("User does not have valid roles");
    return false;
  }

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

    if (foundUser) {
      const newToken = sign(foundUser, process.env.JWT_SECRET!, {
        expiresIn: tokenExpireTime,
      });

      res.cookie("x-access-token", newToken);
    }
  }

  return true;
};
