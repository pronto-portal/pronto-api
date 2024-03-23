import { Prisma } from "@prisma/client";
import {
  Args_2,
  DefaultArgs,
  DynamicQueryExtensionCb,
} from "@prisma/client/runtime/library";
import { deleteRule } from "../../../utils/helper/deleteRule";

type DeleteReminderFunctionType =
  | DynamicQueryExtensionCb<
      Prisma.TypeMap<Args_2 & DefaultArgs>,
      "model",
      "Reminder",
      "delete"
    >
  | undefined;

export const DeleteReminder: DeleteReminderFunctionType = async ({
  args,
  query,
}) => {
  return await query(args).then((reminder) => {
    console.log("Deleting rule");
    if (process.env.NODE_ENV === "production")
      deleteRule({
        reminderId: reminder.id!,
        translatorPhoneNumber: "",
        claimantPhoneNumber: "",
        translatorMessage: "",
        claimantMessage: "",
        claimantLanguage: "en",
        sendSMSUpdate: false,
        claimantOptedOut: false,
        translatorOptedOut: false,
      })
        .then((delRuleRes) => {
          console.log("Deleted rule status: ", delRuleRes);
        })
        .catch(() => {
          console.log("Error deleting rule");
        });

    console.log("Deleted rule?");
    console.log(reminder);

    return reminder;
  });
};
