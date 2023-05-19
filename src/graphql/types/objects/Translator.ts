import { objectType } from "nexus";

export const TranslatorType = objectType({
  name: "Translator",
  definition(t) {
    t.string("id");
    t.string("firstName");
    t.string("lastName");
    t.string("email");
    t.string("phone");
    t.list.nonNull.string("languages");
  },
});
