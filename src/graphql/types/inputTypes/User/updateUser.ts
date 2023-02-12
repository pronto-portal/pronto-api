import { inputObjectType } from "nexus";

export const UpdateUserInput = inputObjectType({
  name: "UpdateUserInput",
  definition(t) {
    t.nullable.string("email");
    t.nullable.string("phone");
    t.nullable.string("firstName");
    t.nullable.string("lastName");
    t.nullable.string("profilePic", { default: "" });
    t.nullable.boolean("isManager", { default: false });
    t.nullable.boolean("isTranslator", { default: false });
  },
});
