import { JwtPayload, decode, sign } from "jsonwebtoken";
import { isJWTTokenValid, isRefreshTokenValid } from "./isTokenValid";
import { isTokenExpired } from "./istokenExpired";
import { Context } from "../../graphql/schema/context";
import { decryptRefreshToken } from "./decryptRefreshToken";

export const isAuthorized = async (ctx: Context) => {
  const token: string | undefined = ctx.req.cookies["x-access-token"];
  const refreshToken: string | undefined = ctx.req.cookies["x-refresh-token"];

  console.log("Found token");

  if (!token) return false;

  console.log("decoding token");
  const decodedToken = decode(token) as JwtPayload;

  // check if token is expired, if it is expired check to see if the user has a valid and unexpired refresh token
  console.log("token", token);
  const isTokenValid = await isJWTTokenValid(token);

  if (!isTokenValid) return false;

  const isJWTExpired = isTokenExpired(decodedToken);

  if (isJWTExpired) {
    console.log("token is expired");
    // check if refresh token is expired
    if (!refreshToken) return false;

    console.log("found refresh token");

    const decryptedRefreshToken = decryptRefreshToken(refreshToken);
    const isRefreshValid = isRefreshTokenValid(decryptedRefreshToken);

    console.log("validated refresh token");

    if (!isRefreshValid) return false;

    console.log("refresh token is valid");

    const decodedRefreshToken = decode(decryptedRefreshToken) as JwtPayload;

    const isRefreshExpired = isTokenExpired(decodedRefreshToken);

    console.log("refresh token is not expired");

    if (isRefreshExpired) return false;

    const user = await ctx.prisma.user.findUnique({
      where: {
        id: decodedToken.id,
      },
    });

    if (user) {
      console.log("assigning new access token");
      const newToken = sign(user, process.env.JWT_SECRET!, {
        expiresIn: 10 * 60 * 60, // expires in 10 hours
      });

      ctx.res.cookie("x-access-token", newToken);
    }
  }

  console.log("is authorized");

  return true;
};
