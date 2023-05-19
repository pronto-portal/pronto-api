import { inputObjectType } from "nexus";

export const DisconnectTranslatorInput = inputObjectType({
  name: "DisconnectTranslatorInput",
  definition(t) {
    t.nonNull.string("email");
  },
});
