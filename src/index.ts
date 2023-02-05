import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import serverlessExpress, {
  getCurrentInvoke,
} from "@vendia/serverless-express";
import express from "express";
import { json } from "body-parser";
import cors from "cors";
import getAppDataSource from "./datasource/datasource";

const server = new ApolloServer({
  typeDefs: "type Query { x: ID }",
  resolvers: { Query: { x: () => "hi!" } },
});

server.startInBackgroundHandlingStartupErrorsByLoggingAndFailingAllRequests();

const app = express();
app.use(
  cors(),
  json(),
  expressMiddleware(server, {
    context: async ({ req, res }) => {
      // API Gateway event and Lambda Context
      const { event, context } = getCurrentInvoke();
      const db = getAppDataSource();

      return {
        expressRequest: req,
        expressResponse: res,
        lambdaEvent: event,
        lambdaContext: context,
        db,
      };
    },
  })
);

exports.graphqlHandler = serverlessExpress({ app });
