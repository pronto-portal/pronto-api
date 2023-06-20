import { PrismaClient, User } from "@prisma/client";
import { Request, Response } from "express";
import { EventBridge } from "aws-sdk";

export interface Context {
  prisma: PrismaClient;
  userId?: string;
  req: Request;
  res: Response;
  user: User;
  eventBridge: EventBridge;
}
