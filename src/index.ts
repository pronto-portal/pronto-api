import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import {
  startServerAndCreateLambdaHandler,
  handlers,
} from "@as-integrations/aws-lambda"; //highlight-line

import { buildSchemaSync } from "type-graphql";
import UserResolver from "./graphql/resolvers/User.resolver";

const schema = buildSchemaSync({
  resolvers: [UserResolver],
});

// other initialization code, like creating http server

const server = new ApolloServer({
  schema,
});

export const graphqlHandler = startServerAndCreateLambdaHandler(
  server,
  handlers.createAPIGatewayProxyEventV2RequestHandler()
);
