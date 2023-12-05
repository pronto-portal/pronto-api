import { User } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Context } from "../../graphql/schema/context";
import { decryptRefreshToken } from "./decryptRefreshToken";
import { encryptRefreshToken } from "./encryptRefreshToken";
import { isTokenExpired } from "./istokenExpired";
import { verifyGoogleToken } from "./verifyGoogleToken";
import { NexusGenInputs } from "../../graphql/schema/nexus-typegen";
import { refreshTokenExpireTime, tokenExpireTime } from "../constants/auth";
import StripeClient from "../../datasource/stripe";
import firstTimeUserOnCreate from "./firstTimeUserOnCreate";
import { Request, Response } from "express";
import prisma from "../../datasource/datasource";
import cookie from "cookie";

interface AuthContext {
  req: Request;
  res: Response;
}

interface AuthPayload {
  userArgs?: NexusGenInputs["CreateUserInput"];
  sub?: string;
  expiresIn?: number;
}

// Returns a user if auth is successful
export const authenticate = async (
  { res, req }: AuthContext,
  { userArgs, sub = "", expiresIn = 0 }: AuthPayload
): Promise<User> => {
  // console.log("Authenticating...");
  // console.log("Verifying google sub...");

  // console.log(`Attempting auth for user with sub ${sub}`);
  // Check if first time user else create user
  console.log("sub: ", sub);

  const user =
    (await prisma.user.update({
      where: { id: sub },
      data: {
        profilePic: userArgs?.profilePic || undefined,
      },
    })) ||
    (userArgs !== undefined
      ? await firstTimeUserOnCreate(userArgs, sub)
      : null);

  if (!user) {
    // console.log("Bad user args");
    res.status(401).json({ message: "bad user args" });
    throw new Error("Invalid token");
  }

  const token = jwt.sign(user, process.env.JWT_SECRET!, {
    expiresIn: tokenExpireTime,
  });

  // console.log(`Token signed`);

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
    // console.log("Refresh token found");
    // send encrypted refresh token back
    //res.cookie("x-refresh-token", userRefreshToken.token);

    const decryptedRefreshToken = decryptRefreshToken(userRefreshToken.token);

    // Decode refresh token
    const decodedRefreshToken = jwt.decode(decryptedRefreshToken) as Record<
      string,
      any
    >;

    // check if refresh token is expired. If expired issue a new one
    if (decodedRefreshToken && isTokenExpired(decodedRefreshToken)) {
      // console.log("Refresh token is expired, creating a new one");
      let newRefreshToken = encryptRefreshToken(
        jwt.sign(user, process.env.REFRESH_SECRET!, {
          expiresIn: refreshTokenExpireTime,
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
      // res.cookie("x-refresh-token", newRefreshToken);
    }
  } else {
    // console.log("No refresh token found, creating a new one");
    // if no refresh token, create a new one for the user
    let newRefreshToken = encryptRefreshToken(
      jwt.sign(user, process.env.REFRESH_SECRET!, {
        expiresIn: refreshTokenExpireTime,
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
  }

  console.log("new Date(expiresIn * 1000): ", new Date(expiresIn));
  res.cookie("x-access-token", token, {
    httpOnly: process.env.NODE_ENV === "production",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(expiresIn),
    domain:
      process.env.NODE_ENV === "production"
        ? "https://prontotranslationservices.com"
        : "",
  });

  console.log("cookie set");

  return user;
};
