import { JwtPayload, decode, sign } from "jsonwebtoken";
import { isJWTTokenValid, isRefreshTokenValid } from "./isTokenValid";
import { isTokenExpired } from "./istokenExpired";
import { Context } from "../../graphql/schema/context";
import { decryptRefreshToken } from "./decryptRefreshToken";

export const isAuthorized = async (ctx: Context) => {
  const token: string | undefined = ctx.req.cookies["x-access-token"];
  const refreshToken: string | undefined = ctx.req.cookies["x-refresh-token"];

  if (!token) return false;

  const decodedToken = decode(token) as JwtPayload;

  // check if token is expired, if it is expired check to see if the user has a valid and unexpired refresh token

  try {
    const isTokenValid = await isJWTTokenValid(token);

    if (!isTokenValid) return false;
  } catch (e) {
    const isJWTExpired = isTokenExpired(decodedToken);

    if (isJWTExpired) {
      // check if refresh token is expired
      if (!refreshToken) return false;

      const decryptedRefreshToken = decryptRefreshToken(refreshToken);

      try {
        const isRefreshValid = isRefreshTokenValid(decryptedRefreshToken);

        if (!isRefreshValid) return false;

        const decodedRefreshToken = decode(decryptedRefreshToken) as JwtPayload;

        const isRefreshExpired = isTokenExpired(decodedRefreshToken);

        if (isRefreshExpired) return false;

        const user = await ctx.prisma.user.findUnique({
          where: {
            id: decodedToken.id,
          },
        });

        if (user) {
          const newToken = sign(user, process.env.JWT_SECRET!, {
            expiresIn: 10 * 60 * 60, // expires in 10 hours
          });

          ctx.res.cookie("x-access-token", newToken);
        }
      } catch (refreshErr) {
        return false;
      }
    }
  }

  return true;
};
