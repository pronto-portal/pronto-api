import { nonNull, objectType } from "nexus";

export const GetAssignmentsResponse = objectType({
  name: "GetAssignmentsResponse",
  definition(t) {
    t.nonNull.int("totalRowCount");
    t.nonNull.list.field("assignments", {
      type: nonNull("Assignment"),
    });
  },
});
