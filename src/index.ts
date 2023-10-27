import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import { json } from "body-parser";
import cors from "cors";
import datasource from "./datasource/datasource";
import schema from "./graphql/schema/schema";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import http from "http";
import { parseAuthHeader } from "./utils/auth/parseAuthHeader";
import { eventBridge } from "./aws/eventBridge";
import stripeRoutes from "./routes/stripe";
import { isAuthorizedBase } from "./utils/auth/isAuthorizedBase";

const main = async () => {
  const prisma = datasource;
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(cookieParser());
  app.use(
    "/graphql",
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
        const accessToken = parseAuthHeader(req.headers.authorization);

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

  app.use("/stripe", stripeRoutes);

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000/`);
};

main();
