import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import { json } from "body-parser";
import cors from "cors";
import getAppDataSource from "./datasource/datasource";
import schema from "./graphql/schema/schema";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import serverlessExpress from "@vendia/serverless-express";
import AWS from "aws-sdk";

const server = new ApolloServer({
  schema,
});

server.startInBackgroundHandlingStartupErrorsByLoggingAndFailingAllRequests();

const app = express();

app.use(cookieParser());
app.use(
  "/",
  cors({
    origin: ["http://localhost:3000"], // frontend domain
    credentials: true,
  }),
  json(),
  expressMiddleware(server, {
    context: async ({ req, res }) => {
      // API Gateway event and Lambda Context
      const prisma = getAppDataSource();
      const eventBridge = new AWS.EventBridge({ apiVersion: "2015-10-07" });

      const accessToken = req.cookies["x-access-token"];

      let user: User | null = null;

      if (accessToken) user = jwt.decode(accessToken) as User;

      return {
        req,
        res,
        user,
        prisma,
        eventBridge,
      };
    },
  })
);

exports.handler = serverlessExpress({ app });
