import { inputObjectType } from "nexus";

export const UpdateReminderinput = inputObjectType({
  name: "UpdateReminderInput",
  definition(t) {
    t.nonNull.string("id");
    t.string("translatorMessage");
    t.string("claimantMessage");
    t.string("cronSchedule");
  },
});
