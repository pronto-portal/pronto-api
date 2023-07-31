import { extendType, nonNull } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";
import { ReminderType } from "../../types";

export const getReminder = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("getReminder", {
      type: ReminderType,
      authorize: async (_root, _args, ctx) => await isAuthorized(ctx),
      args: { input: nonNull("ByIdInput") },
      async resolve(_, { input }, { prisma }) {
        const { id } = input;

        const reminder = await prisma.reminder.findUniqueOrThrow({
          where: {
            id,
          },
        });

        return reminder;
      },
    });
  },
});
