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

    console.log("Old assignment", oldAssignment);

    if (oldAssignment) {
      const oldTranslatorId = oldAssignment.assignedToId;
      const oldReminder = oldAssignment.reminder
        ? await prisma.reminder.delete({
            where: {
              id: oldAssignment.reminder.id,
            },
          })
        : oldAssignment.reminder;

      console.log("Old reminder", oldReminder);

      if (oldTranslatorId && oldTranslatorId !== translatorId) {
        // I need to delete the old reminder here in aws and notify the old translator
        if (oldReminder) {
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
            console.log("Old translator phone", oldTranslatorPhone);

            if (process.env.NODE_ENV === "production" && newTranslator)
              await sendSMS({
                message: `You have been unassigned from an appointment with ${oldClaimant.firstName} ${oldClaimant.lastName} on ${oldAssignment.dateTime}`,
                phoneNumber: oldTranslatorPhone,
              }).then(() => {
                console.log("Unassigned SMS sent to old translator");
              });
          }

          // I need to create a new reminder here in aws and notify the new translator
          if (oldClaimant) {
            console.log("Creating new reminder...");
            console.log("Assignment id", oldAssignment.id);
            console.log("User id", user.id);

            await prisma.reminder
              .create({
                data: {
                  claimantMessage: oldReminder.claimantMessage,
                  translatorMessage: oldReminder.translatorMessage,
                  assignment: {
                    connect: {
                      id: oldAssignment.id,
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
