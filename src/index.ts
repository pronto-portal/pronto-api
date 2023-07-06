import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import { json } from "body-parser";
import cors from "cors";
import getAppDataSource from "./datasource/datasource";
import schema from "./graphql/schema/schema";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import AWS from "aws-sdk";
import http from "http";

const main = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  console.log("API_GATEWAY_DNS", process.env.API_GATEWAY_DNS);
  app.use(cookieParser());
  app.use(
    "/",
    cors({
      origin: ["http://localhost:3000", process.env.API_GATEWAY_DNS!], // frontend domain
      credentials: true,
      methods: ["POST", "GET", "OPTIONS"],
      exposedHeaders: ["set-cookie", "Cookie"],
      allowedHeaders: [
        "set-cookie",
        "Cookie",
        "Content-Type",
        "Origin",
        "Accept",
        "X-XSS-Protection",
        "Authorization",
      ],
    }),
    json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        // API Gateway event and Lambda Context
        const prisma = getAppDataSource();
        const eventBridge = new AWS.EventBridge({ apiVersion: "2015-10-07" });

        console.log("HEADERS", JSON.stringify(req.headers));
        const accessToken = req.cookies["x-access-token"];
        console.log("REQ set-cookie", req.headers["set-cookie"]);
        console.log("REQ SET-COOKIE", req.headers["Set-Cookie"]);
        console.log("RES HEADERS", res.getHeaders());

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

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000/`);
};

main();
