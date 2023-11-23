import { Router } from "express";
import prisma from "../datasource/datasource";
import { authenticate } from "../utils/auth/authenticate";
import getAuthPayload from "../utils/auth/getAuthPayload";

const authRouter = Router();

interface LoginInput {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

authRouter.post("/login", async (req, res) => {
  const reqBody: LoginInput = req.body;

  const user = await authenticate({ req, res, prisma }, reqBody);

  return res.status(200).json(user);
});

authRouter.post("/signout", async (req, res) => {
  try {
    const decodedToken = JSON.parse(
      Buffer.from(req.headers.authorization || "", "base64").toString()
    );

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
    return res.status(500).json({ message: "Error signing out" });
  }
});

export default authRouter;
