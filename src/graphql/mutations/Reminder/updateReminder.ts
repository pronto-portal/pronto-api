import { extendType, nonNull } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";
import { ReminderType, UpdateReminderinput } from "../../types";

// todo: test updateReminder
export const UpdateReminder = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updateReminder", {
      type: ReminderType,
      authorize: async (_root, _args, ctx) => await isAuthorized(ctx),
      args: {
        input: nonNull(UpdateReminderinput),
      },
      async resolve(_, { input }, { prisma, user }) {
        const { id, translatorMessage, claimantMessage, cronSchedule } = input;

        return await prisma.reminder.update({
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
            cronSchedule: cronSchedule || undefined,
          },
        });
      },
    });
  },
});
