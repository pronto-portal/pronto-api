import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import serverlessExpress, {
  getCurrentInvoke,
} from "@vendia/serverless-express";
import express from "express";
import { json } from "body-parser";
import cors from "cors";
import getAppDataSource from "./datasource/datasource";
import schema from "./graphql/schema/schema";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { Context } from "./graphql/schema/context";

const prisma = getAppDataSource();

const main = async () => {
  const server = new ApolloServer({
    schema,
  });

  //server.startInBackgroundHandlingStartupErrorsByLoggingAndFailingAllRequests();
  await server.start();

  const app = express();

  app.use(cookieParser());
  app.use(
    cors({
      origin: "*", // frontend domain
      credentials: false,
    }),
    json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        // API Gateway event and Lambda Context
        const { event, context } = getCurrentInvoke();
        console.log("my ctx");

        console.log(req.url);

        // console.log("ctx");
        // const token = req.cookies["next-auth.session-token"];
        // console.log(req.cookies);
        //console.log(token);
        // try {
        //   const verified = jwt.decode(token);
        //   console.log("verified", verified);
        // } catch (e) {
        //   console.log(e);
        // }

        return {
          req: req,
          res: res,
          lambdaEvent: event,
          lambdaContext: context,
          prisma,
        };
      },
    })
  );

  app.listen(4000, () => {
    console.log("NOW LISTENING");
  });

  //return serverlessExpress({ app });
};

main();

//exports.handler = handler;
