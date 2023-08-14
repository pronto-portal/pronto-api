import { nonNull, objectType } from "nexus";

export const GetAddressesResponse = objectType({
  name: "GetAddressesResponse",
  definition(t) {
    t.nonNull.int("totalRowCount");
    t.nonNull.list.field("addresses", {
      type: nonNull("Address"),
    });
  },
});
