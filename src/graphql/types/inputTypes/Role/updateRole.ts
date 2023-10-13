import { inputObjectType } from "nexus";

export const UpdateRoleInput = inputObjectType({
  name: "UpdateRoleInput",
  definition(t) {
    t.string("name");
    t.string("description");
    t.int("priceCents");
  },
});
