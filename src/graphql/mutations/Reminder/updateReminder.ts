import { extendType, nonNull } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";
import { ReminderType, UpdateReminderinput } from "../../types";

export const UpdateReminder = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updateReminder", {
      type: ReminderType,
      authorize: async (_root, _args, ctx) => await isAuthorized(ctx),
      args: {
        input: nonNull(UpdateReminderinput),
      },
      async resolve(_, { input }, { prisma, user, eventBridge }) {
        const { id, translatorMessage, claimantMessage } = input;

        return await prisma.reminder
          .update({
            where: {
              id,
              createdBy: {
                id: user.id,
              },
            },
            include: {
              assignment: {
                include: {
                  claimant: true,
                  assignedTo: true,
                },
              },
            },
            data: {
              translatorMessage: translatorMessage || undefined,
              claimantMessage: claimantMessage || undefined,
            },
          })
          .then(async (reminder) => {
            const ruleName = `reminder-${reminder.id}`;
            const claimantPhone = reminder.assignment.claimant?.phone;
            const translatorPhone = reminder.assignment.assignedTo.phone;

            // todo: when updating translator/claimant phonenumber update the payload of this target
            await eventBridge
              .putTargets({
                Rule: ruleName,
                Targets: [
                  {
                    Id: reminder.id,
                    Arn: process.env.REMINDER_FUNCTION_ARN!,
                    Input: JSON.stringify({
                      payload: {
                        translatorPhone,
                        translatorMessage,
                        claimantPhone,
                        claimantMessage,
                      },
                    }),
                  },
                ],
              })
              .promise();

            return reminder;
          });
      },
    });
  },
});
