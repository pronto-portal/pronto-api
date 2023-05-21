import { inputObjectType } from "nexus";

export const CreateAssignmentInput = inputObjectType({
  name: "CreateAssignmentInput",
  definition(t) {
    t.nonNull.string("translatorId");
    t.nonNull.string("claimantId");
    t.nonNull.string("addressId");
    t.nonNull.field("dateTime", {
      type: "DateTime",
    });
  },
});
