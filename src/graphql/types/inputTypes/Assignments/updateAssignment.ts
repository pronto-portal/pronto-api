import { inputObjectType } from "nexus";

export const UpdateAssignmentInput = inputObjectType({
  name: "UpdateAssignmentInput",
  definition(t) {
    t.nonNull.string("id");
    t.nullable.string("translatorId");
    t.nullable.string("claimantId");
    t.field("address", {
      type: "UpdateAddressInput",
    });
    t.nullable.string("addressId");
    t.nullable.field("dateTime", {
      type: "DateTime",
    });
    t.nullable.boolean("isComplete");
    t.nullable.boolean("claimantNoShow");
    t.nullable.boolean("translatorNoShow");
  },
});
