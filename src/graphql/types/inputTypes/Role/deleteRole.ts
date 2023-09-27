import { inputObjectType } from "nexus";

export const DeleteRoleInput = inputObjectType({
  name: "DeleteRoleInput",
  definition(t) {
    t.nonNull.string("name");
  },
});
