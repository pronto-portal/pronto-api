import { inputObjectType } from "nexus";

export const AddTranslatorInput = inputObjectType({
  name: "AddTranslatorInput",
  definition(t) {
    t.nonNull.string("email");
  },
});
