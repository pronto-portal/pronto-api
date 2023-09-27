import { inputObjectType } from "nexus";

export const UpdateRoleInput = inputObjectType({
  name: "UpdateRoleInput",
  definition(t) {
    t.string("name");
    t.int("priceCents");
  },
});
