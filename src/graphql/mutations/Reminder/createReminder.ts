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

        console.log("dateTime", dateTime);
        // console.log("dateTimeCron", dateTimeCron);

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
            .then(async (data) => {
              console.log(
                `user ${user.id} created eventbride rule ${reminder.id} for assignment ${assignment} scheduled for ${dateTime}`
              );

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
                .catch(async (err) => {
                  console.log("PUT TARGETS ERROR");
                  console.log(err);

                  // Delete reminder since reminder has not actually been created:
                  await prisma.reminder.delete({
                    where: {
                      id: reminder.id,
                    },
                  });
                });

              return data;
            })
            .catch(async (err) => {
              console.log("PUT RULE ERROR");
              console.log(err);

              await eventBridge
                .deleteRule({
                  Name: ruleName,
                })
                .promise()
                .then(() => {
                  console.log(`Rule ${ruleName} deleted`);
                })
                .catch((deleteRuleErr) => {
                  console.log(`Error deleting rule ${ruleName}`);
                  console.log(deleteRuleErr);
                });
              // Delete reminder since reminder has not actually been created:
              await prisma.reminder.delete({
                where: {
                  id: reminder.id,
                },
              });
              return err;
            });
        }

        return reminder;
      },
    });
  },
});
