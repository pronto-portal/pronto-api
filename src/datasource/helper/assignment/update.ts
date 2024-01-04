import { Prisma, Reminder } from "@prisma/client";
import {
  Args_2,
  DefaultArgs,
  DynamicQueryExtensionCb,
} from "@prisma/client/runtime/library";
import { updateRule } from "../../../utils/helper/updateRule";

type UpdateAssignmentFunctionType =
  | DynamicQueryExtensionCb<
      Prisma.TypeMap<Args_2 & DefaultArgs>,
      "model",
      "Assignment",
      "update"
    >
  | undefined;

export const UpdateAssignment: UpdateAssignmentFunctionType = async ({
  args,
  query,
}) => {
  return await query(args).then((assignment) => {
    const reminder = assignment.reminder as any as Reminder;

    if (reminder && args.data.dateTime) {
      const dateTime = args.data.dateTime as Date;
      console.log(`setting datetime ${dateTime}`);
      console.log(dateTime);

      const ruleName = `reminder-${reminder.id}`;
      console.log(`ruleName: ${ruleName}`);

      if (process.env.NODE_ENV === "production" && reminder && reminder.id)
        updateRule({
          reminderId: reminder.id,
          dateTime: dateTime,
        });
      else {
        console.log("No reminder id, cannot update rule");
      }
    }
    return assignment;
  });
};
