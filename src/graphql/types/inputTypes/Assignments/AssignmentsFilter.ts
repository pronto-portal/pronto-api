import { inputObjectType } from "nexus";

export const AssignmentsFilter = inputObjectType({
  name: "AssignmentsFilter",
  definition(t) {
    t.nullable.field("address", {
      type: "AddressesFilter",
    });
    t.nullable.field("assignedTo", {
      type: "TranslatorsFilter",
    });
    t.nullable.field("claimant", {
      type: "ClaimantsFilter",
    });
    t.nullable.field("dateRange", {
      type: "DateRange",
    });
    t.nullable.date("date");
    t.nullable.boolean("isCancelled");
  },
});
