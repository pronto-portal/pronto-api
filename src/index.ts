import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import { json } from "body-parser";
import cors from "cors";
import getAppDataSource from "./datasource/datasource";
import schema from "./graphql/schema/schema";
import cookieParser from "cookie-parser";
import http from "http";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Context } from "./graphql/schema/context";
import { isJWTTokenValid } from "./utils/auth/isTokenValid";

const prisma = getAppDataSource();

const main = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    schema,
  });

  await server.start();

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

        // decode access token then get user
        //const isJWTValid: boolean = await isJWTTokenValid(token);
        //console.log("isJWTValid", isJWTValid);

        let user = null;
        // if (isJWTValid) {
        //   const decodedJWT = jwt.decode(token) as JwtPayload;

        //   user = await prisma.user.findUnique({
        //     where: {
        //       id: decodedJWT.sub,
        //     },
        //   });
        // }

        return {
          req,
          res,
          user,
          prisma,
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
