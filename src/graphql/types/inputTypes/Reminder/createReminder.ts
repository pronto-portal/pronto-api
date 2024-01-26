import { inputObjectType } from "nexus";

export const CreateReminderInput = inputObjectType({
  name: "CreateReminderInput",
  definition(t) {
    t.nonNull.string("assignmentId");
    t.string("translatorMessage");
    t.string("claimantMessage");
    t.string("cronSchedule");
  },
});
