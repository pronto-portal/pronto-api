import { isAuthorizedBase } from "./isAuthorizedBase";
import { Request, Response } from "express";

export const isAuthorizedExpress = async (req: Request, res: Response) => {
  return isAuthorizedBase({ res, req }, "basic");
};
