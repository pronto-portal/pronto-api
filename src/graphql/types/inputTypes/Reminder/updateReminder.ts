import { inputObjectType } from "nexus";

export const UpdateRemindinput = inputObjectType({
  name: "UpdateReminderInput",
  definition(t) {
    t.boolean("isEmail");
    t.boolean("isSMS");
    t.string("translatorMessage");
    t.string("claimantMessage");
  },
});
