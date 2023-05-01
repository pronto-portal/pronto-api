import { inputObjectType } from "nexus";

export const CompleteProfileInput = inputObjectType({
  name: "CompleteProfileInput",
  definition(t) {
    t.nonNull.string("phone");
    t.nonNull.string("firstName");
    t.nonNull.string("lastName");
    t.nonNull.boolean("isManager");
    t.nonNull.boolean("isTranslator");
    t.list.nonNull.string("languages");
  },
});
