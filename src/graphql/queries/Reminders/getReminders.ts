import { extendType, list, nonNull } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";
import { ReminderType } from "../../types";

export const GetReminders = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("getReminders", {
      type: nonNull("GetRemindersResponse"),
      authorize: async (_root, _args, ctx) => await isAuthorized(ctx),
      args: { input: nonNull("PaginatedInput") },
      async resolve(_, { input }, { prisma, user }) {
        const { page, countPerPage } = input;

        // todo: instead of having a nested query, modify the prisma schema such that Reminders and claimants are
        // also stored on the user table via relations as well
        const reminders = await prisma.reminder.findMany({
          where: {
            createdById: user.id,
          },
          include: {
            assignment: true,
          },
          skip: (page - 1) * countPerPage,
          take: countPerPage,
        });

        const totalRowCount = await prisma.reminder.count({
          where: {
            createdById: user.id,
          },
        });

        return { reminders, totalRowCount };
      },
    });
  },
});
