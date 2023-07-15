import { inputObjectType } from "nexus";

export const CreateReminderInput = inputObjectType({
  name: "CreateReminderInput",
  definition(t) {
    t.nonNull.string("assignmentId");
    t.boolean("isEmail");
    t.boolean("isSMS");
    t.string("translatorSubject");
    t.string("translatorMessage");
    t.string("claimantSubject");
    t.string("claimantMessage");
  },
});
