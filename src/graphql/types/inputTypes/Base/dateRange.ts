import { inputObjectType } from "nexus";

export const DateRange = inputObjectType({
  name: "DateRange",
  definition(t) {
    t.nonNull.date("date1");
    t.nonNull.date("date2");
  },
});
