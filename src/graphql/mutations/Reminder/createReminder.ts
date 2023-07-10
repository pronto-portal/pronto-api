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

        const ruleName = `reminder-${reminder.id}`;

        if (reminder) {
          await eventBridge
            .putRule({
              Name: ruleName,
              Description: `reminder: ${reminder.id} created by user: ${user.id}`,
              ScheduleExpression: `cron(${dateTimeCron})`,
              State: "ENABLED",
              RoleArn: process.env.EVENT_RULE_ROLE_ARN,
            })
            .promise()
            .then((data) => {
              console.log(
                `user ${user.id} created eventbride rule ${reminder.id} for assignment ${assignment} scheduled for ${dateTime}`
              );
              return data;
            })
            .catch((err) => {
              console.error(err);
              return err;
            });

          await eventBridge
            .putTargets({
              Rule: ruleName,
              Targets: [
                {
                  Id: reminder.id,
                  Arn: process.env.REMINDER_FUNCTION_ARN!,
                  Input: JSON.stringify({
                    payload: {
                      translatorMessage,
                      claimantMessage,
                    },
                  }),
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
