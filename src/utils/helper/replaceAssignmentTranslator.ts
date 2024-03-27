import prisma from "../../datasource/base";
import { sendSMS } from "../sendSMS";
import { User } from "@prisma/client";

export const replaceAssignmentTranslator = async (
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
        assignedTo: {
          include: {
            phoneRef: true,
          },
        },
        claimant: {
          include: {
            phoneRef: true,
          },
        },
        address: true,
      },
    });

    console.log("Old assignment", oldAssignment);

    if (oldAssignment) {
      const oldTranslatorId = oldAssignment.assignedToId;

      if (oldTranslatorId && oldTranslatorId !== translatorId) {
        // I need to delete the old reminder here in aws and notify the old translator
        const oldReminder = oldAssignment.reminder;

        console.log("Old reminder", oldReminder);

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
                recepientIsOptedOut: oldTranslator.phoneRef?.optedOut || false,
              }).then(() => {
                console.log("Unassigned SMS sent to old translator");
              });
          }

          // I need to create a new reminder here in aws and notify the new translator
          if (oldClaimant) {
            console.log("Creating new reminder...");
            console.log("Assignment id", oldAssignment.id);
            console.log("User id", user.id);
          }
        }
      }
    }
  } catch (err) {
    console.log("replaceAssignmentTranslatorAndUpdateReminder", err);
  }
};
