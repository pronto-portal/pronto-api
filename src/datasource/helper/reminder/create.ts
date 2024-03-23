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
          optedOut: true,
        },
      },
      assignedTo: {
        select: {
          phone: true,
          optedOut: true,
        },
      },
    },
  });

  if (assignment) {
    const dateTime = (assignment.dateTime! as Date).toISOString();
    const cronString = reminder.cronSchedule || dateToCron(dateTime);
    console.log("Creating reminder rule");
    console.log("Reminder cronSchedule: ", reminder.cronSchedule);
    console.log("Cron String: ", cronString);

    console.log("Assignment Date time", assignment.dateTime);
    console.log("Assignment Date time ISO", dateTime);
    console.log("Assignment Date time Cron", cronString);

    const ruleName = `reminder-${reminder.id}`;
    console.log("Rule Name: ", ruleName);
    console.log("is prod? ", process.env.NODE_ENV === "production");

    if (process.env.NODE_ENV === "production") {
      console.log("creating rule");
      createRule({
        reminderId: reminder.id!,
        createdById: reminder.createdById!,
        translatorPhoneNumber: assignment.assignedTo!.phone || "",
        claimantPhoneNumber: assignment.claimant!.phone,
        translatorMessage: reminder.translatorMessage!,
        claimantMessage: reminder.claimantMessage!,
        claimantLanguage: assignment.claimant!.primaryLanguage ?? "en",
        cronString,
        assignmentDate: assignment.dateTime,
        claimantOptedOut: assignment.claimant!.optedOut,
        translatorOptedOut: assignment.assignedTo!.optedOut,
      }).then(({ success }) => {
        if (!success)
          eventBridge
            .removeTargets({
              Rule: ruleName,
              Ids: [reminder.id!],
            })
            .promise()
            .then(() =>
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
                })
                .catch((err) => {
                  console.log("Err ", err);
                  return err;
                })
            )
            .catch((err) => {
              console.log("Err ", err);
              return err;
            });

        // Delete reminder since reminder has not actually been created:
      });
    }
  }

  return reminder;
};
