import { JwtPayload, decode, sign } from "jsonwebtoken";
import { isJWTTokenValid, isRefreshTokenValid } from "./isTokenValid";
import { isTokenExpired } from "./istokenExpired";
import { Context } from "../../graphql/schema/context";
import { decryptRefreshToken } from "./decryptRefreshToken";
import { parseAuthHeader } from "./parseAuthHeader";

export const isAuthorized = async ({ res, req, prisma, user }: Context) => {
  const token: string = parseAuthHeader(req.headers.authorization);

  console.log("TOKEN", token);

  const refreshTokenRecord = await prisma.refreshToken.findUnique({
    where: {
      userId: user.id,
    },
  });

  const refreshToken: string | undefined = refreshTokenRecord?.token;

  if (!token) return false;

  console.log("Token found, decoding token");
  const decodedToken = decode(token) as JwtPayload;

  // check if token is expired, if it is expired check to see if the user has a valid and unexpired refresh token

  try {
    console.log("Validating token");
    const isTokenValid = await isJWTTokenValid(token);

    if (!isTokenValid) return false;
  } catch (e) {
    console.log("Invalid token");
    const isJWTExpired = isTokenExpired(decodedToken);

    if (isJWTExpired) {
      console.log("Token is expired");
      // check if refresh token is expired
      if (!refreshToken) {
        console.log("No refresh token found, token cannot be refreshed");
        return false;
      }

      console.log("Decrypting refresh token");
      const decryptedRefreshToken = decryptRefreshToken(refreshToken);

      try {
        console.log("Validating refresh token");
        const isRefreshValid = isRefreshTokenValid(decryptedRefreshToken);

        if (!isRefreshValid) {
          console.log("Refresh token is not valid");

          // deleting invalid refresh token
          await prisma.refreshToken.delete({
            where: {
              id: refreshTokenRecord!.id,
            },
          });

          return false;
        }

        const decodedRefreshToken = decode(decryptedRefreshToken) as JwtPayload;

        const isRefreshExpired = isTokenExpired(decodedRefreshToken);

        if (isRefreshExpired) {
          console.log("Refresh token is expired");

          // deleting expired refresh token
          await prisma.refreshToken.delete({
            where: {
              id: refreshTokenRecord!.id,
            },
          });
          return false;
        }

        const user = await prisma.user.findUnique({
          where: {
            id: decodedToken.id,
          },
        });

        if (user) {
          console.log("Refreshing token");
          const newToken = sign(user, process.env.JWT_SECRET!, {
            expiresIn: 10 * 60 * 60, // expires in 10 hours
          });

          res.cookie("x-access-token", newToken);
        }
      } catch (refreshErr) {
        console.log("Invalid refresh token");
        console.log(refreshErr);
        return false;
      }
    }
  }

  return true;
};
