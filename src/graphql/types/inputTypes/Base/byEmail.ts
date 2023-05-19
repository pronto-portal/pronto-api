import { inputObjectType } from "nexus";

// todo: have all queries that only take a email as an input use this type instead of their current type
export const ByEmail = inputObjectType({
  name: "ByEmailInput",
  definition(t) {
    t.nonNull.string("email");
  },
});
