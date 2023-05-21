import { inputObjectType } from "nexus";

export const CreateClaimantInput = inputObjectType({
  name: "CreateClaimantInput",
  definition(t) {
    t.nonNull.string("firstName");
    t.nonNull.string("lastName");
    t.nullable.string("email");
    t.nonNull.string("phone");
    t.list.nonNull.string("languages");
  },
});
