import prisma from "../../datasource/datasource";
import { eventBridge } from "../../aws/eventBridge";
import { sendSMS } from "../sendSMS";
import { User } from "@prisma/client";

export const replaceAssignmentTranslatorAndUpdateReminder = async (
  id: string,
  translatorId: string,
  user: User
) => {
  try {
    const oldAssignment = await prisma.assignment.findUnique({
      where: {
        id,
      },
      include: {
        reminder: true,
        assignedTo: true,
        claimant: true,
      },
    });

    if (oldAssignment) {
      const oldTranslatorId = oldAssignment.assignedToId;
      const oldReminder = oldAssignment.reminder;
      if (oldTranslatorId && oldTranslatorId !== translatorId) {
        // I need to delete the old reminder here in aws and notify the old translator
        if (oldReminder) {
          const oldReminderId = oldReminder.id;
          const oldRuleName = `reminder-${oldReminderId}`;
          const oldTranslator = oldAssignment.assignedTo;
          const oldClaimant = oldAssignment.claimant;

          if (oldTranslator && oldClaimant) {
            const oldTranslatorPhone = oldTranslator.phone!;

            if (process.env.NODE_ENV === "production")
              await eventBridge
                .removeTargets({
                  Rule: oldRuleName,
                  Ids: [oldReminderId],
                })
                .promise()
                .then(() =>
                  eventBridge
                    .deleteRule({
                      Name: oldRuleName,
                    })
                    .promise()
                    .then(() =>
                      sendSMS({
                        message: `You have been unassigned from an appointment with ${oldClaimant.firstName} ${oldClaimant.lastName} on ${oldAssignment.dateTime}`,
                        phoneNumber: oldTranslatorPhone,
                      })
                    )
                );
          }

          // I need to create a new reminder here in aws and notify the new translator
          if (oldClaimant) {
            await prisma.reminder.create({
              data: {
                claimantMessage: oldReminder.claimantMessage,
                translatorMessage: oldReminder.translatorMessage,
                assignment: {
                  connect: {
                    id,
                  },
                },
                createdBy: {
                  connect: {
                    id: user.id,
                  },
                },
              },
            });
          }
        }
      }
    }
  } catch (err) {
    console.log("replaceAssignmentTranslatorAndUpdateReminder", err);
  }
};
