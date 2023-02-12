import { inputObjectType } from "nexus";

export const CreateUserInput = inputObjectType({
  name: "CreateUserInput",
  definition(t) {
    t.nonNull.string("email");
    t.nonNull.string("phone");
    t.nonNull.string("firstName");
    t.nonNull.string("lastName");
    t.nonNull.string("profilePic", { default: "" });
    t.nonNull.boolean("isManager", { default: false });
    t.nonNull.boolean("isTranslator", { default: false });
  },
});
