import { inputObjectType } from "nexus";

export const AddNonUserTranslatorInput = inputObjectType({
  name: "AddNonUserTranslatorInput",
  definition(t) {
    t.nonNull.string("email");
    t.nonNull.string("firstName");
    t.nonNull.string("lastName");
    t.string("phone");
    t.string("city");
    t.string("state");
    t.nullable.list.nonNull.string("languages");
  },
});
