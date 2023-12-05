import { Router } from "express";
import prisma from "../datasource/datasource";
import { authenticate } from "../utils/auth/authenticate";
import getAuthPayload from "../utils/auth/getAuthPayload";
import { google } from "googleapis";
import { parseAuthHeader } from "../utils/auth/parseAuthHeader";
import { decode } from "jsonwebtoken";
import { User } from "@prisma/client";
const authRouter = Router();
const redirectUri =
  process.env.NODE_ENV === "production" && process.env.API_GATEWAY_URL
    ? `${process.env.API_GATEWAY_URL}/auth/google/callback`
    : "http://localhost:4000/dev/auth/google/callback";
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET_ID,
  redirectUri
);

interface LoginInput {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

// authRouter.post("/login", async (req, res) => {
//   const reqBody: LoginInput = req.body;

//   const user = await authenticate({ req, res, prisma }, reqBody);

//   return res.status(200).json(user);
// });

authRouter.post("/signout", async (req, res) => {
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

authRouter.get("/auth/google", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    response_type: "code",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/user.phonenumbers.read",
    ],
  });

  return res.status(200).json({ url });
});

authRouter.get("/auth/google/callback", async (req, res) => {
  try {
    console.log("attempting to authenticate");
    const { code } = req.query;
    console.log("code: ", code);
    if (!code) {
      res.status(400).send("Invalid request: No code provided");
      return;
    }

    console.log("token exists");
    // Exchange the authorization code for an access token
    const { tokens } = await oauth2Client.getToken(code as string);

    console.log("token exists");

    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });

    console.log("credentials set");

    // Retrieve user information
    console.log("getting user data");
    const userInfo = await oauth2.userinfo.get();
    console.log("got user data");
    const expiresIn = tokens.expiry_date;
    const userData = userInfo.data;
    if (userData) {
      console.log("userData: ", userData);
      console.log("attempting to authenticate");
      const user = await authenticate(
        {
          req,
          res,
        },
        {
          sub: userData.id!,
          expiresIn: expiresIn!,
          userArgs: {
            email: userData.email!,
            firstName: userData.given_name!,
            lastName: userData.family_name!,
            profilePic: userData.picture!,
          },
        }
      );
      if (!user) throw new Error("User not found");

      res.redirect(
        process.env.NODE_ENV === "production"
          ? `https://prontotranslationservices.com/`
          : `http://localhost:3000/`
      );
    } else {
      return;
    }
    // Handle the user's session, token, etc.
    // ...
  } catch (error) {
    console.error("Error during OAuth callback", error);
    res.status(500).send("Error during OAuth callback");
  }
});

export default authRouter;
