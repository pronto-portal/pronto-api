import { makeSchema } from "nexus";
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
    module: require.resolve("./context.ts"),
    export: "Context",
  },
  outputs: {
    typegen: join(__dirname, "./nexus-typegen.ts"),
    schema: join(__dirname, "./schema.graphql"),
  },
});

export default schema;
