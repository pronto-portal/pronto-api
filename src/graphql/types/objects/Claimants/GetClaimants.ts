import { nonNull, objectType } from "nexus";

export const GetClaimantsResponse = objectType({
  name: "GetClaimantsResponse",
  definition(t) {
    t.nonNull.int("totalRowCount");
    t.nonNull.list.field("claimants", {
      type: nonNull("Claimant"),
    });
  },
});
