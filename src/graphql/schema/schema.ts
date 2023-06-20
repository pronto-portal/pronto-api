import { makeSchema, fieldAuthorizePlugin } from "nexus";
import * as types from "../allTypes";
import { join } from "path";

const schema = makeSchema({
  types,
  sourceTypes: {
    modules: [
      {
        module: require.resolve(".prisma/client/index.d.ts"),
        alias: "prisma",
      },
    ],
  },
  contextType: {
    module: join(__dirname, "context"),
    export: "Context",
  },
  outputs: {
    typegen: join(__dirname, "./nexus-typegen"),
    schema: join(__dirname, "./schema.graphql"),
  },
  plugins: [fieldAuthorizePlugin()],
});

export default schema;
