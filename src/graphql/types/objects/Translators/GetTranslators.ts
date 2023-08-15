import { nonNull, objectType } from "nexus";

export const GetTranslatorsResponse = objectType({
  name: "GetTranslatorsResponse",
  definition(t) {
    t.nonNull.int("totalRowCount");
    t.nonNull.list.field("translators", {
      type: nonNull("User"),
    });
  },
});
