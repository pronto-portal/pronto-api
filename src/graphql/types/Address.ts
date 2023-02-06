import { objectType } from "nexus";
import { Address } from "nexus-prisma";

const AddressType = objectType({
  name: Address.$name,
  description: Address.$description,
  definition(t) {
    t.field(Address.id);
    t.field(Address.address1);
    t.field(Address.address2);
    t.field(Address.state);
    t.field(Address.zipCode);
    t.field(Address.assignment);
  },
});

export default AddressType;
