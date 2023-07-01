import { JwtPayload, decode, sign } from "jsonwebtoken";
import { isJWTTokenValid, isRefreshTokenValid } from "./isTokenValid";
import { isTokenExpired } from "./istokenExpired";
import { Context } from "../../graphql/schema/context";
import { decryptRefreshToken } from "./decryptRefreshToken";

export const isAuthorized = async (ctx: Context) => {
  const token: string | undefined = ctx.req.cookies["x-access-token"];
  const refreshToken: string | undefined = ctx.req.cookies["x-refresh-token"];

  console.log("----------------------------------------");
  console.log("Attempting authorization");
  console.log("COOKIES", ctx.req.cookies);
  console.log("REQ", JSON.stringify(ctx.req));
  console.log("----------------------------------------");

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
          return false;
        }

        const decodedRefreshToken = decode(decryptedRefreshToken) as JwtPayload;

        const isRefreshExpired = isTokenExpired(decodedRefreshToken);

        if (isRefreshExpired) {
          console.log("Refresh token is expired");
          return false;
        }

        const user = await ctx.prisma.user.findUnique({
          where: {
            id: decodedToken.id,
          },
        });

        if (user) {
          console.log("Refreshing token");
          const newToken = sign(user, process.env.JWT_SECRET!, {
            expiresIn: 10 * 60 * 60, // expires in 10 hours
          });

          ctx.res.cookie("x-access-token", newToken);
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
