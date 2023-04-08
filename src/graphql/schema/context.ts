import { PrismaClient, User } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  userId?: string;
  req: Request;
  res: Response;
  user: User | null;
}

export function createContext(
  req: Request,
  res: Response,
  user: User
): Context {
  return { prisma, userId: "", req, res, user };
}
