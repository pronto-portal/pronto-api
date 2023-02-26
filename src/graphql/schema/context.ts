import { PrismaClient, User } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  userId?: string;
  req: Request;
  res: Response;
}

export function createContext(req: Request, res: Response): Context {
  return { prisma, userId: "", req, res };
}
