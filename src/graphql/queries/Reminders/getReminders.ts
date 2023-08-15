import { extendType, nonNull, nullable } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";

// todo: test filtering
export const GetReminders = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("getReminders", {
      type: nonNull("GetRemindersResponse"),
      authorize: async (_root, _args, ctx) => await isAuthorized(ctx),
      args: {
        input: nonNull("PaginatedInput"),
        where: nullable("RemindersFilter"),
      },
      async resolve(_, { input, where }, { prisma, user }) {
        const { page, countPerPage } = input;

        const reminders = await prisma.reminder.findMany({
          where: {
            createdById: user.id,
            ...(where
              ? {
                  assignment: {
                    dateTime: where.date
                      ? {
                          equals: where.date,
                        }
                      : where.range
                      ? {
                          gte: where.range.date1,
                          lte: where.range.date2,
                        }
                      : undefined,
                  },
                }
              : {}),
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
