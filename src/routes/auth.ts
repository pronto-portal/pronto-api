import { Router } from "express";
import prisma from "../datasource/datasource";
import { authenticate } from "../utils/auth/authenticate";

const authRouter = Router();

interface LoginInput {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

authRouter.post("/login", async (req, res) => {
  const reqBody: LoginInput = req.body;
  console.log(reqBody);

  const user = await authenticate({ req, res, prisma }, reqBody);

  console.log(user);

  return res.status(200).json(user);
});

authRouter.post("/signout", async (req, res) => {
  res.cookie("x-access-token", "", { maxAge: 0, expires: new Date(0) });
  res.status(200).json({ message: "Successfully signed out" });
});

export default authRouter;
