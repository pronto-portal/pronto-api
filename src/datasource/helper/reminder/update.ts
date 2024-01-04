import { Prisma } from "@prisma/client";
import {
  Args_2,
  DefaultArgs,
  DynamicQueryExtensionCb,
} from "@prisma/client/runtime/library";
import { updateRule } from "../../../utils/helper/updateRule";
import prisma from "../../base";

type UpdateReminderFunction =
  | DynamicQueryExtensionCb<
      Prisma.TypeMap<Args_2 & DefaultArgs>,
      "model",
      "Reminder",
      "update"
    >
  | undefined;

export const UpdateReminder: UpdateReminderFunction = async ({
  args,
  query,
}) => {
  return await query({ ...args }).then(async (reminder) => {
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
        assignedToUser: {
          select: {
            phone: true,
          },
        },
        reminder: {
          select: {
            id: true,
          },
        },
      },
    });

    if (assignment) {
      const id = assignment.reminder ? assignment.reminder.id : "";
      const claimantPhone = assignment.claimant!.phone;

      const translator = assignment.assignedTo;
      const translatorPhone = translator!.phone;

      console.log("Updating rule");
      const translatorMessage =
        args.data.translatorMessage?.toString() ||
        reminder.translatorMessage ||
        "";

      const claimantMessage =
        args.data.claimantMessage?.toString() || reminder.claimantMessage || "";
      if (id)
        await updateRule({
          reminderId: id,
          translatorPhoneNumber: translatorPhone || undefined,
          claimantPhoneNumber: claimantPhone,
          translatorMessage,
          claimantMessage,
          claimantLanguage: assignment.claimant!.primaryLanguage ?? "en",
          dateTime: assignment.dateTime!,
        });
      else {
        console.log("No reminder id, cannot update rule");
      }

      // todo: when updating translator/claimant phonenumber update the payload of this target
    }

    return reminder;
  });
};
