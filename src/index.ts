import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import { json } from "body-parser";
import corsConfig from "./utils/config/cors";
import getAppDataSource from "./datasource/datasource";
import schema from "./graphql/schema/schema";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import http from "http";
import { parseAuthHeader } from "./utils/auth/parseAuthHeader";
import { eventBridge } from "./aws/eventBridge";
import stripeRoutes from "./routes/stripe";
import authRouter from "./routes/auth";
import errorHandlingPlugin from "./utils/apollo/errorHandlingPlugin";

const main = async () => {
  console.log("Starting server...");
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      errorHandlingPlugin,
    ],
  });

  await server.start();

  app.use(corsConfig);
  app.use(cookieParser());

  app.use("/stripe", stripeRoutes);
  app.use(json());
  app.use("/", authRouter);
  // healthcheck route
  app.use("/healthcheck", (_req, res) => {
    res.status(200).send("OK");
  });

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async (context) => {
        const { req, res } = context;
        // API Gateway event and Lambda Context
        const accessToken = req.cookies["x-access-token"];
        const prisma = getAppDataSource(context);

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
