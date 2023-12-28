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
        address: true,
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
          const oldTranslator = { ...oldAssignment.assignedTo };
          const oldClaimant = { ...oldAssignment.claimant };

          const newTranslator = await prisma.nonUserTranslator.findUnique({
            where: {
              id: translatorId,
            },
            select: {
              phone: true,
            },
          });

          if (oldTranslator && oldClaimant) {
            const oldTranslatorPhone = oldTranslator.phone!;

            if (process.env.NODE_ENV === "production" && newTranslator)
              await eventBridge
                .removeTargets({
                  Rule: oldRuleName,
                  Ids: [oldReminderId],
                })
                .promise()
                .then(() => {
                  console.log(
                    "Successfully removed targets from rule",
                    oldRuleName
                  );
                  return eventBridge
                    .deleteRule({
                      Name: oldRuleName,
                    })
                    .promise()
                    .then(() => {
                      console.log("Sending SMS to old translator...");
                      return sendSMS({
                        message: `You have been unassigned from an appointment with ${oldClaimant.firstName} ${oldClaimant.lastName} on ${oldAssignment.dateTime}`,
                        phoneNumber: oldTranslatorPhone,
                      }).then(() => {});
                    })
                    .catch((err) =>
                      console.log(
                        "replaceAssignmentTranslatorAndUpdateReminder deleteRule",
                        err
                      )
                    );
                })
                .catch((err) => {
                  console.log(
                    "replaceAssignmentTranslatorAndUpdateReminder removeTargets",
                    err
                  );
                });
          }

          // I need to create a new reminder here in aws and notify the new translator
          if (oldClaimant) {
            console.log("Creating new reminder...");
            await prisma.reminder
              .create({
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
              })
              .then(() => {
                console.log("Sending SMS to new translator");
                const address1 = oldAssignment.address?.address1;
                const address2 = oldAssignment.address?.address2;
                const city = oldAssignment.address?.city;
                const state = oldAssignment.address?.state;
                const zip = oldAssignment.address?.zipCode;
                const address = `${address1} ${address2} ${city} ${state} ${zip}`;
                return sendSMS({
                  message: `You have been assigned to an appointment with ${
                    oldClaimant.firstName
                  } ${
                    oldClaimant.lastName
                  } on ${oldAssignment.dateTime.toLocaleDateString()}, at ${address}`,
                  phoneNumber: newTranslator ? newTranslator.phone || "" : "",
                });
              });
          }
        }
      }
    }
  } catch (err) {
    console.log("replaceAssignmentTranslatorAndUpdateReminder", err);
  }
};
