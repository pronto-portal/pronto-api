import { isAuthorizedBase } from "./isAuthorizedBase";
import { Request, Response, NextFunction } from "express";

export const isAuthorizedExpress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return isAuthorizedBase({ res, req }, "basic")
    .then(() => next())
    .catch(() => res.status(401).json({ message: "Unauthorized" }));
};
