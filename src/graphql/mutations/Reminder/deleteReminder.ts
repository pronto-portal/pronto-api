import { extendType, nonNull } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";
import { ReminderType } from "../../types";

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

        console.log("Attempting to delete reminder with an id of ", id);
        const reminder = await prisma.reminder
          .delete({
            where: {
              id,
              createdBy: {
                id: user.id,
              },
            },
          })
          .then((rem) => {
            console.log("Successfully deleted reminder with an id of ", id);
            console.log("________________________________________");
            return prisma.user
              .update({
                where: {
                  id: user.id,
                },
                data: {
                  remindersCreatedThisMonth: {
                    decrement: 1,
                  },
                },
              })
              .then(() => rem)
              .catch((uErr) => {
                console.error("USER ERROR ERROR ERROR", uErr);
                return uErr;
              });
          })
          .catch((err) => {
            console.error("ERROR ERROR ERROR", err);
            return err;
          });

        return reminder;
      },
    });
  },
});
