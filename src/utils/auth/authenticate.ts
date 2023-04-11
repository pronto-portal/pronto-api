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
    throw new Error("Invalid token");
  }

  const { sub } = await verifyGoogleToken(authToken);
  console.log("VERIFIED GOOGLE SUB", sub);

  console.log("User ARGS", userArgs);
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

  console.log("AUTH USER", user);

  if (!user) {
    console.log("BAD USER ARGS");
    res.status(401).json({ message: "bad user args" });
    throw new Error("Invalid token");
  }

  //console.log("SIGNING JWT!");
  const token = jwt.sign(user, process.env.JWT_SECRET!, {
    expiresIn: 10 * 60 * 60, // expires in 10 hours
  });

  console.log("TOKEN: ", token);

  console.log("FINDING REFRESH TOKEN");
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
    console.log("FOUND REFRESH TOKEN!", userRefreshToken.token);

    // send encrypted refresh token back
    res.cookie("x-refresh-token", userRefreshToken.token);

    const decryptedRefreshToken = decryptRefreshToken(userRefreshToken.token);
    console.log("DECRYPTED REFRESH TOKEN!", decryptedRefreshToken);
    const isValid = await isRefreshTokenValid(decryptedRefreshToken);
    console.log("VALIDATED REFRESH TOKEN!");

    if (!isValid) {
      res.status(401).json({ message: "Invalid token" });
      throw new Error("Invalid token");
    }

    // Decode refresh token
    const decodedRefreshToken = jwt.decode(decryptedRefreshToken) as JwtPayload;

    // check if refresh token is expired. If expired issue a new one
    if (decodedRefreshToken && isTokenExpired(decodedRefreshToken)) {
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
    // if no refresh token, create a new one for the user
    console.log("NO REFRESH TOKEN AVAILABLE, ENCRYPTING NEW ONE");
    let newRefreshToken = encryptRefreshToken(
      jwt.sign(user, process.env.REFRESH_SECRET!, {
        expiresIn: 7 * 24 * 60 * 60, // expires in 7 days
      })
    );

    console.log("ENCRYPTED REFRESH TOKEN!", newRefreshToken);

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

    console.log("CREATED NEW REFRESH TOKEN!");

    // send new encrypted refresh token back
    res.cookie("x-refresh-token", newRefreshToken);
  }

  console.log("authenticate token", token);

  res.cookie("x-access-token", token);

  return user;
};
