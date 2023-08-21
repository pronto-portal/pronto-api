import { inputObjectType } from "nexus";

export const TranslatorsFilter = inputObjectType({
  name: "TranslatorsFilter",
  definition(t) {
    t.nullable.string("id");
    t.nullable.string("email");
    t.nullable.string("phone");
    t.nullable.list.nonNull.string("languages");
    t.nullable.string("city");
    t.nullable.string("state");
    t.nullable.string("firstName");
    t.nullable.string("lastName");
  },
});
