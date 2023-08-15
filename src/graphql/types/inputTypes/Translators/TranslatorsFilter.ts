import { inputObjectType } from "nexus";

export const TranslatorsFilter = inputObjectType({
  name: "TranslatorsFilter",
  definition(t) {
    t.nullable.string("language");
    t.nullable.string("city");
    t.nullable.string("state");
    t.nullable.string("firstName");
    t.nullable.string("lastName");
  },
});
