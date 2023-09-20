import { inputObjectType } from "nexus";

export const UpdateNonUserTranslatorInput = inputObjectType({
  name: "UpdateNonUserTranslatorInput",
  definition(t) {
    t.nonNull.string("id");
    t.string("email");
    t.string("firstName");
    t.string("lastName");
    t.string("phone");
    t.string("city");
    t.string("state");
    t.nullable.list.nonNull.string("languages");
  },
});
