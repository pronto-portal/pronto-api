import { PrismaClient } from "@prisma/client";
import { eventBridge } from "../aws/eventBridge";
import { dateToCron } from "../utils/helper/dateToCron";

const getAppDataSource = () => {
  const prisma = new PrismaClient();

  const xprisma = prisma.$extends({
    query: {
      reminder: {
        async update({ model, operation, args, query }) {
          return await query({ ...args }).then(async (reminder) => {
            if (
              reminder.assignment &&
              reminder.assignment.claimant &&
              reminder.assignment.assignedTo
            ) {
              const id = reminder.id!;
              const ruleName = `reminder-${id}`;
              const claimantPhone = reminder.assignment.claimant.scalars.phone!;
              const translatorPhone = reminder.assignment.assignedTo.phone!;

              await eventBridge
                .putTargets({
                  Rule: ruleName,
                  Targets: [
                    {
                      Id: id,
                      Arn: process.env.REMINDER_FUNCTION_ARN!,
                      Input: JSON.stringify({
                        payload: {
                          translatorPhone,
                          translatorMessage:
                            args.data.translatorMessage ??
                            reminder.translatorMessage,
                          claimantPhone,
                          claimantMessage:
                            args.data.claimantMessage ??
                            reminder.claimantMessage,
                        },
                      }),
                    },
                  ],
                })
                .promise();

              // todo: when updating translator/claimant phonenumber update the payload of this target
            }

            return reminder;
          });
        },
        async delete({ model, operation, args, query }) {
          return await query(args).then((reminder) => {
            const ruleName = `reminder-${reminder.id}`;

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

            return reminder;
          });
        },
        async create({ model, operation, args, query }) {
          const reminder = await query(args);

          const assignment = reminder.assignment;
          if (assignment) {
            const dateTime = (assignment.dateTime! as Date).toISOString();
            const dateTimeCron = dateToCron(dateTime);

            const ruleName = `reminder-${reminder.id}`;

            await eventBridge
              .putRule({
                Name: ruleName,
                Description: `reminder: ${reminder.id} created by user: ${reminder.createdById}`,
                ScheduleExpression: `cron(${dateTimeCron})`,
                State: "ENABLED",
                RoleArn: process.env.EVENT_RULE_ROLE_ARN,
              })
              .promise()
              .then(async (data) => {
                const translator = assignment.assignedTo;
                const claimant = assignment.claimant;

                if (translator && claimant) {
                  const translatorPhone = translator.phone;
                  const claimantPhone = claimant.scalars.phone;

                  await eventBridge
                    .putTargets({
                      Rule: ruleName,
                      Targets: [
                        {
                          Id: reminder.id!,
                          Arn: process.env.REMINDER_FUNCTION_ARN!,
                          Input: JSON.stringify({
                            payload: {
                              translatorPhone,
                              translatorMessage: args.data.translatorMessage,
                              claimantPhone,
                              claimantMessage: args.data.claimantMessage,
                            },
                          }),
                        },
                      ],
                    })
                    .promise()
                    .catch(async () => {
                      // Delete reminder since reminder has not actually been created:
                      await prisma.reminder.delete({
                        where: {
                          id: reminder.id,
                        },
                      });
                    });
                } else {
                  throw new Error(
                    "Assignment must have claimant and translator"
                  );
                }

                return data;
              })
              .catch(async (err) => {
                await eventBridge
                  .deleteRule({
                    Name: ruleName,
                  })
                  .promise();

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
      },
      assignment: {
        async update({ model, operation, args, query }) {
          return await query(args).then((assignment) => {
            const { reminder } = assignment;
            if (reminder && args.data.dateTime) {
              const dateTime = args.data.dateTime as Date;

              const ruleName = `reminder-${reminder.scalars.id}`;
              eventBridge.putRule({
                Name: ruleName,
                ScheduleExpression: `cron(${dateToCron(
                  dateTime.toISOString()
                )})`,
              });
            }
            return assignment;
          });
        },
      },
    },
  });

  return xprisma;
};

export default getAppDataSource;
