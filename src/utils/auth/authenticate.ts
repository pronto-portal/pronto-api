import { User } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Context } from "../../graphql/schema/context";
import { decryptRefreshToken } from "./decryptRefreshToken";
import { encryptRefreshToken } from "./encryptRefreshToken";
import { isTokenExpired } from "./istokenExpired";
import { isRefreshTokenValid } from "./isTokenValid";
import { verifyGoogleToken } from "./verifyGoogleToken";
import { NexusGenInputs } from "../../graphql/schema/nexus-typegen";

// Returns a user if auth is successful
export const authenticate = async (
  { res, req, prisma }: Context,
  userArgs?: NexusGenInputs["CreateUserInput"]
): Promise<User> => {
  const authToken = req.headers.authorization?.replace("Bearer ", "");

  if (!authToken) {
    res.status(401).json({ message: "Invalid token" });
    console.log("Invalid token");
    throw new Error("Invalid token");
  }

  console.log("Verifying google sub...");

  const { sub } = await verifyGoogleToken(authToken);

  console.log(`Attempting auth for user with sub ${sub}`);
  // Check if first time user else create user
  const user =
    (await prisma.user.findUnique({ where: { id: sub } })) ||
    (userArgs !== undefined
      ? await prisma.user.create({
          data: {
            id: sub,
            ...userArgs,
          },
        })
      : null);

  if (!user) {
    console.log("Bad user args");
    res.status(401).json({ message: "bad user args" });
    throw new Error("Invalid token");
  }

  const token = jwt.sign(user, process.env.JWT_SECRET!, {
    expiresIn: 10 * 60 * 60, // expires in 10 hours
  });

  console.log(`Token signed`);

  // Decrypt refresh token if exists
  const userRefreshToken = await prisma.refreshToken.findUnique({
    where: {
      userId: user.id,
    },
    include: {
      user: true,
    },
  });

  if (userRefreshToken && userRefreshToken.token) {
    console.log("Refresh token found");
    // send encrypted refresh token back
    res.cookie("x-refresh-token", userRefreshToken.token);

    const decryptedRefreshToken = decryptRefreshToken(userRefreshToken.token);

    // Decode refresh token
    const decodedRefreshToken = jwt.decode(decryptedRefreshToken) as Record<
      string,
      any
    >;

    // check if refresh token is expired. If expired issue a new one
    if (decodedRefreshToken && isTokenExpired(decodedRefreshToken)) {
      console.log("Refresh token is expired, creating a new one");
      let newRefreshToken = encryptRefreshToken(
        jwt.sign(user, process.env.REFRESH_SECRET!, {
          expiresIn: 7 * 24 * 60 * 60, // expires in 7 days
        })
      );

      await prisma.refreshToken.update({
        where: {
          id: userRefreshToken.id,
        },
        data: {
          token: newRefreshToken,
        },
      });

      // send updated encrypted refresh token back
      res.cookie("x-refresh-token", newRefreshToken);
    }
  } else {
    console.log("No refresh token found, creating a new one");
    // if no refresh token, create a new one for the user
    let newRefreshToken = encryptRefreshToken(
      jwt.sign(user, process.env.REFRESH_SECRET!, {
        expiresIn: 7 * 24 * 60 * 60, // expires in 7 days
      })
    );

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    // send new encrypted refresh token back
    // todo: change to secure when prod ready
    res.cookie("x-refresh-token", newRefreshToken, {
      httpOnly: false,
      secure: true,
      sameSite: "none",
    });
  }

  res.cookie("x-access-token", token, {
    httpOnly: false,
    secure: true,
    sameSite: "none",
  });

  return user;
};
