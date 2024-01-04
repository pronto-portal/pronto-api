import { Prisma } from "@prisma/client";
import {
  Args_2,
  DefaultArgs,
  DynamicQueryExtensionCb,
} from "@prisma/client/runtime/library";
import prisma from "../../base";
import { dateToCron } from "../../../utils/helper/dateToCron";
import { createRule } from "../../../utils/helper/createRule";
import { eventBridge } from "../../../aws/eventBridge";

type CreateReminderFunctionType =
  | DynamicQueryExtensionCb<
      Prisma.TypeMap<Args_2 & DefaultArgs>,
      "model",
      "Reminder",
      "create"
    >
  | undefined;

export const CreateReminder: CreateReminderFunctionType = async ({
  args,
  query,
}) => {
  const reminder = await query(args);

  const assignment = await prisma.assignment.findUnique({
    where: {
      id: reminder.assignmentId,
    },
    include: {
      claimant: {
        select: {
          phone: true,
          primaryLanguage: true,
        },
      },
      assignedTo: {
        select: {
          phone: true,
        },
      },
    },
  });

  if (assignment) {
    const dateTime = (assignment.dateTime! as Date).toISOString();
    const dateTimeCron = dateToCron(dateTime);

    console.log("Assignment Date time", assignment.dateTime);
    console.log("Assignment Date time ISO", dateTime);
    console.log("Assignment Date time Cron", dateTimeCron);

    const ruleName = `reminder-${reminder.id}`;

    if (process.env.NODE_ENV === "production")
      createRule({
        reminderId: reminder.id!,
        createdById: reminder.createdById!,
        translatorPhoneNumber: assignment.assignedTo!.phone || "",
        claimantPhoneNumber: assignment.claimant!.phone,
        translatorMessage: reminder.translatorMessage!,
        claimantMessage: reminder.claimantMessage!,
        claimantLanguage: assignment.claimant!.primaryLanguage ?? "en",
        dateTime: assignment.dateTime,
      }).then(({ success }) => {
        if (!success)
          eventBridge
            .deleteRule({
              Name: ruleName,
            })
            .promise()
            .then(() => {
              prisma.reminder.delete({
                where: {
                  id: reminder.id,
                },
              });
            });

        // Delete reminder since reminder has not actually been created:
      });
  }

  return reminder;
};
