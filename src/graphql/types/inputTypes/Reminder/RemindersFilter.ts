import { inputObjectType } from "nexus";

export const RemindersFilter = inputObjectType({
  name: "RemindersFilter",
  definition(t) {
    t.nullable.field("range", {
      type: "DateRange",
    });
    t.nullable.string("date");
  },
});
