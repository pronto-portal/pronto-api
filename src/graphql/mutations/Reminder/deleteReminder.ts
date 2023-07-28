import { extendType, nonNull } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";
import { ReminderType } from "../../types";
import { dateToCron } from "../../../utils/helper/dateToCron";
import { addressToString } from "../../../utils/helper/addressToString";

export const DeleteReminder = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("deleteReminder", {
      type: nonNull(ReminderType),
      authorize: async (_root, _args, ctx) => await isAuthorized(ctx),
      args: {
        input: nonNull("ByIdInput"),
      },
      async resolve(_, { input }, { prisma, user, eventBridge }) {
        const { id } = input;

        const reminder = await prisma.reminder
          .delete({
            where: {
              id,
              createdBy: {
                id: user.id,
              },
            },
          })
          .then((res) => {
            const ruleName = `reminder-${res.id}`;

            eventBridge
              .deleteRule({
                Name: ruleName,
              })
              .promise()
              .then(async (data) => {
                console.log(`Successfully deleted rule ${ruleName}`);
                return data;
              })
              .catch(async (err) => {
                console.log(`Error deleting rule ${ruleName}`);
                console.log(err);
              });

            return res;
          });

        return reminder;
      },
    });
  },
});
