import { extendType, nonNull } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";
import { CreateReminderInput, ReminderType } from "../../types";
import { dateToCron } from "../../../utils/helper/dateToCron";

export const CreateReminder = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createReminder", {
      type: ReminderType,
      authorize: async (_root, _args, ctx) => await isAuthorized(ctx),
      args: {
        input: nonNull(CreateReminderInput),
      },
      async resolve(_, { input }, { prisma, user, eventBridge }) {
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
        });

        if (!assignment) throw new Error("You do not own this assignment");

        const reminder = await prisma.reminder.create({
          data: {
            isEmail,
            isSMS,
            translatorMessage,
            claimantMessage,
            assignment: {
              connect: {
                id: assignmentId,
              },
            },
          },
          include: {
            assignment: true,
          },
        });

        const dateTime = assignment.dateTime.toISOString();
        const dateTimeCron = dateToCron(dateTime);

        if (reminder) {
          const rule = await eventBridge
            .putRule({
              Name: `${reminder.id}`,
              ScheduleExpression: `cron(${dateTimeCron})`,
              State: "ENABLED",
            })
            .promise()
            .catch((err) => console.error(err));

          const targets = await eventBridge
            .putTargets({
              Rule: `${reminder.id}`,
              Targets: [
                {
                  Id: "",
                  Arn: "",
                },
              ],
            })
            .promise()
            .catch((err) => console.error(err));
        }

        return reminder;
      },
    });
  },
});
