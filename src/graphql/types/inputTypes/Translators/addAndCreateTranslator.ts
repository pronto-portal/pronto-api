import { inputObjectType } from "nexus";

export const AddAndCreateTranslatorInput = inputObjectType({
  name: "AddAndCreateTranslatorInput",
  definition(t) {
    t.nonNull.string("email");
    t.nonNull.string("phone");
    t.nonNull.string("firstName");
    t.nullable.string("lastName");
    t.nullable.string("city");
    t.nullable.string("state");
    t.list.nonNull.string("languages");
  },
});
