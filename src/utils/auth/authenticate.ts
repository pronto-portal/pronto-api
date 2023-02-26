import { User } from "@prisma/client";
import { AES } from "crypto-js";
import { Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Context } from "../../graphql/schema/context";
import { decryptRefreshToken } from "./decryptRefreshToken";
import { encryptRefreshToken } from "./encryptRefreshToken";
import { isTokenExpired } from "./istokenExpired";
import { isRefreshTokenValid } from "./isTokenValid";

export const authenticate = async (user: User, { res, prisma }: Context) => {
  const token = jwt.sign(user, process.env.JWT_SECRET!, {
    expiresIn: 10 * 60 * 60, // expires in 10 hours
  });

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
    const decryptedRefreshToken = decryptRefreshToken(userRefreshToken.token);
    const isValid = await isRefreshTokenValid(decryptedRefreshToken);

    if (!isValid) throw new Error("invalid refreshtoken");

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

      res.cookie("x-refresh-token", decryptedRefreshToken, {
        httpOnly: true,
      });
    } else {
      // if token is valid and not expired then set the
      res.cookie("x-refresh-token", decryptedRefreshToken, {
        httpOnly: true,
      });
    }
  } else {
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

    res.cookie("x-refresh-token", newRefreshToken, {
      httpOnly: true,
    });
  }

  // const refresh = jwt.sign({
  //   ...user,
  //   count: user.tokenCount}, process.env.REFRESH_SECRET!)

  res.cookie("x-access-token", token, {
    httpOnly: true,
  });
};
