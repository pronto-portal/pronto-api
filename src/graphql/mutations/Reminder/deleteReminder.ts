import { extendType, nonNull } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";
import { ReminderType } from "../../types";
import { dateToCron } from "../../../utils/helper/dateToCron";
import { addressToString } from "../../../utils/helper/addressToString";

// todo: test delete reminder
export const DeleteReminder = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("deleteReminder", {
      type: nonNull(ReminderType),
      authorize: async (_root, _args, ctx) => await isAuthorized(ctx),
      args: {
        input: nonNull("ByIdInput"),
      },
      async resolve(_, { input }, { prisma, user }) {
        const { id } = input;

        const reminder = await prisma.reminder.delete({
          where: {
            id,
            createdBy: {
              id: user.id,
            },
          },
        });

        return reminder;
      },
    });
  },
});
