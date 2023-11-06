import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import { json } from "body-parser";
import corsConfig from "./utils/config/cors";
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

  app.use(corsConfig);
  app.use(cookieParser());

  app.use("/stripe", stripeRoutes);
  app.use(json());
  app.use(
    "/graphql",
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

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000/`);
};

main();
