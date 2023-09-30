import { objectType } from "nexus";

export const LanguageType = objectType({
  name: "Language",
  definition(t) {
    t.string("name");
    t.string("code");
  },
});
