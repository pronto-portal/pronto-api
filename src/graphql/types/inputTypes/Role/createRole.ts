import { inputObjectType } from "nexus";

export const CreateRoleInput = inputObjectType({
  name: "CreateRoleInput",
  definition(t) {
    t.nonNull.string("name");
    t.nonNull.int("priceCents");
  },
});
