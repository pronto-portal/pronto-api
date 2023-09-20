import { nonNull, objectType } from "nexus";

export const GetNonUserTranslatorsResponse = objectType({
  name: "GetNonUserTranslatorsResponse",
  definition(t) {
    t.nonNull.int("totalRowCount");
    t.nonNull.list.field("translators", {
      type: nonNull("Translator"),
    });
  },
});
