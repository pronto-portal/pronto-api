import { makeSchema, fieldAuthorizePlugin } from "nexus";
import * as types from "../allTypes";
import { join } from "path";

const schema = makeSchema({
  types,
  shouldGenerateArtifacts: true,
  sourceTypes: {
    modules: [
      {
        module: require.resolve(".prisma/client/index.d.ts"),
        alias: "prisma",
      },
    ],
  },
  contextType: {
    module: require.resolve("./context"),
    export: "Context",
  },
  outputs: {
    typegen: join(__dirname, "./nexus-typegen.d.ts"),
    schema: join(__dirname, "./schema.graphql"),
  },
  plugins: [
    fieldAuthorizePlugin({
      formatError({ error, ctx }) {
        ctx.res.status(401);
        error.message = "unauthorized";
        error.stack = "";
        error.name = "UnauthorizedError";

        return error;
      },
    }),
  ],
});

export default schema;
