import { extendType, nonNull } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";
import { CreateReminderInput, ReminderType } from "../../types";
import { addressToString } from "../../../utils/helper/addressToString";
import { Translate } from "../../../utils/helper/googleTranslate";

export const CreateReminder = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createReminder", {
      type: nonNull(ReminderType),
      authorize: async (_root, _args, ctx) =>
        await isAuthorized(ctx, "basic", true, "reminders"),
      args: {
        input: nonNull(CreateReminderInput),
      },
      async resolve(_, { input }, { prisma, user }) {
        const { assignmentId, translatorMessage, claimantMessage } = input;

        const assignment = await prisma.assignment.findFirst({
          where: {
            id: assignmentId,
            createdBy: {
              id: user.id,
            },
          },
          include: {
            assignedTo: true,
            claimant: true,
            address: true,
          },
        });

        const address = assignment?.address;
        const claimant = assignment?.claimant;

        let defaultReminderMessage = "";
        if (address) {
          const addressString = addressToString({
            address1: address.address1,
            address2: address.address2 || "",
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
          });

          defaultReminderMessage = `You are scheduled for ${assignment.dateTime.toDateString()} at ${addressString}`;
        }

        if (!assignment) throw new Error("You do not own this assignment");

        let translatedClaimantMessage =
          claimantMessage || defaultReminderMessage;

        if (claimant) {
          const [translations] = await Translate.translate(
            claimantMessage || defaultReminderMessage,
            claimant.primaryLanguage || "en"
          );

          translatedClaimantMessage = translations;
        }
        const reminder = await prisma.reminder.create({
          data: {
            translatorMessage: translatorMessage || defaultReminderMessage,
            claimantMessage: translatedClaimantMessage,
            assignment: {
              connect: {
                id: assignmentId,
              },
            },
            createdBy: {
              connect: {
                id: user.id,
              },
            },
          },
          include: {
            assignment: true,
          },
        });

        return reminder;
      },
    });
  },
});
