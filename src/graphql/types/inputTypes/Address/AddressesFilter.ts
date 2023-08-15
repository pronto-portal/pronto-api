import { inputObjectType } from "nexus";

export const AddressesFilter = inputObjectType({
  name: "AddressesFilter",
  definition(t) {
    t.nullable.string("address1");
    t.nullable.string("address2");
    t.nullable.string("city");
    t.nullable.string("state");
    t.nullable.string("zipCode");
  },
});
