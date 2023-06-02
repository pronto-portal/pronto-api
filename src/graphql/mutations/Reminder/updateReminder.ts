import { extendType, nonNull } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";
import { ReminderType, UpdateRemindinput } from "../../types";

export const UpdateReminder = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updateReminder", {
      type: ReminderType,
      authorize: async (_root, _args, ctx) => await isAuthorized(ctx),
      args: {
        input: nonNull(UpdateRemindinput),
      },
      async resolve(_, { input }, { prisma, user }) {
        const {
          assignmentId,
          isEmail,
          isSMS,
          translatorMessage,
          claimantMessage,
        } = input;

        const assignment = await prisma.assignment.findFirst({
          where: {
            id: assignmentId,
            createdBy: {
              id: user.id,
            },
          },
          include: {
            reminder: {
              select: { id: true },
            },
          },
        });

        if (!assignment) throw new Error("You do not own this assignment");

        if (!assignment.reminder)
          throw new Error("This reminder does not exist");

        const reminder = await prisma.reminder.update({
          where: {
            id: assignment.reminder.id,
          },
          data: {
            isEmail: isEmail === null ? undefined : isEmail,
            isSMS: isSMS === null ? undefined : isSMS,
            translatorMessage: translatorMessage || undefined,
            claimantMessage: claimantMessage || undefined,
          },
        });

        return reminder;
      },
    });
  },
});
