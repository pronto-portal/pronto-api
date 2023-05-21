import { inputObjectType } from "nexus";

export const CreateAddressInput = inputObjectType({
  name: "CreateAddressInput",
  definition(t) {
    t.nonNull.string("address1");
    t.nullable.string("address2");
    t.nonNull.string("city");
    t.nonNull.string("state");
    t.nonNull.string("zipCode");
  },
});
