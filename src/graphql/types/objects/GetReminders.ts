import { nonNull, objectType } from "nexus";

export const GetRemindersResponse = objectType({
  name: "GetRemindersResponse",
  definition(t) {
    t.nonNull.int("totalRowCount");
    t.nonNull.list.field("reminders", {
      type: nonNull("Reminder"),
    });
  },
});
