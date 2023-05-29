import { inputObjectType } from "nexus";

export const UpdateAddressInput = inputObjectType({
  name: "UpdateAddressInput",
  definition(t) {
    t.nonNull.string("id");
    t.nullable.string("address1");
    t.nullable.string("address2");
    t.nullable.string("city");
    t.nullable.string("state");
    t.nullable.string("zipCode");
  },
});
