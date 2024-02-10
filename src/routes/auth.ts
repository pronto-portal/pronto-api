import { Router } from "express";
import prisma from "../datasource/base";
import { authenticate } from "../utils/auth/authenticate";
import { google } from "googleapis";
import { decode } from "jsonwebtoken";
import { User } from "@prisma/client";
const authRouter = Router();
const redirectUri =
  process.env.NODE_ENV === "production"
    ? `https://prontotranslationservices.com/api/auth/google/callback`
    : "http://localhost:3000/api/auth/google/callback";
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET_ID,
  redirectUri
);

authRouter.post("/login", async (req, res) => {
  try {
    const googleIdToken = req.headers.authorization;

    console.log("googleIdToken", googleIdToken);

    if (!googleIdToken) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const googleIdTokenLoginTicket = await oauth2Client.verifyIdToken({
      idToken: googleIdToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const googlePayload = googleIdTokenLoginTicket.getPayload();

    if (!googlePayload) {
      return res.status(401).json({ message: "Invalid token" });
    }

    console.log("googlePayload", googlePayload);

    const { exp, sub, email, given_name, family_name, picture } = googlePayload;

    const user = await authenticate(
      {
        req,
        res,
      },
      {
        sub,
        expiresIn: exp,
        userArgs: {
          email: email!,
          firstName: given_name!,
          lastName: family_name!,
          profilePic: picture!,
        },
      }
    );

    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error logging in" });
  }
});

authRouter.post("/signout", async (req, res) => {
  console.log("signing out");
  console.log("headers", req.headers);
  try {
    const authHeader = req.headers.authorization;

    const decodedToken = authHeader ? (decode(authHeader) as User) : undefined;

    console.log("decodedToken", decodedToken);

    if (decodedToken)
      await prisma.refreshToken
        .delete({
          where: {
            userId: (decodedToken as any).sub,
          },
        })
        .then(() => {
          console.log("Refresh token deleted for ", decodedToken.id);
        })
        .catch((err) => {
          console.log("Error deleting refresh token", err);
        });

    res.cookie("x-access-token", "", {
      maxAge: 0,
      expires: new Date(0),
      httpOnly: false,
      secure: false,
      sameSite: "none",
    });
    return res.status(200).json({ message: "Successfully signed out" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error signing out" });
  }
});

export default authRouter;
