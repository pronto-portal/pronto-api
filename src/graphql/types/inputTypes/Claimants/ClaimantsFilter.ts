import { inputObjectType } from "nexus";

export const ClaimantsFilter = inputObjectType({
  name: "ClaimantsFilter",
  definition(t) {
    t.nullable.string("language");
    t.nullable.string("firstName");
    t.nullable.string("lastName");
  },
});
