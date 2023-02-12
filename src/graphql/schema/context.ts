import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  userId: string;
}

export function createContext(): Context {
  return { prisma, userId: "" };
}
