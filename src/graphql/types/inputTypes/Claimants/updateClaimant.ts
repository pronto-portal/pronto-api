import { inputObjectType } from "nexus";

export const UpdateClaimantInput = inputObjectType({
  name: "UpdateClaimantInput",
  definition(t) {
    t.nonNull.string("id");
    t.nullable.string("firstName");
    t.nullable.string("lastName");
    t.nullable.string("email");
    t.nullable.string("phone");
    t.nullable.list.nonNull.string("languages");
  },
});
