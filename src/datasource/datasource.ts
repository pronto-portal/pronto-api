import { PrismaClient, Reminder, Role } from "@prisma/client";
import { eventBridge } from "../aws/eventBridge";
import { dateToCron } from "../utils/helper/dateToCron";

// Reminders are linked to aws event bridge rules via a shared id between a reminder instance and a single event bridge rule
const getAppDataSource = () => {
  const prisma = new PrismaClient();

  const xprisma = prisma.$extends({
    query: {
      reminder: {
        async update({ model, operation, args, query }) {
          return await query({ ...args }).then(async (reminder) => {
            const assignment = await prisma.assignment.findUnique({
              where: {
                id: reminder.assignmentId,
              },
              include: {
                claimant: {
                  select: {
                    phone: true,
                  },
                },
                assignedTo: {
                  select: {
                    phone: true,
                  },
                },
                assignedToUser: {
                  select: {
                    phone: true,
                  },
                },
              },
            });

            if (assignment) {
              const id = reminder.id!;
              const ruleName = `reminder-${id}`;
              const claimantPhone = assignment.claimant!.phone;

              const translator = assignment.assignedTo;
              const translatorPhone = translator!.phone;

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

            console.log("Deleting rule");
            if (process.env.NODE_ENV === "production")
              eventBridge
                .removeTargets({
                  Rule: ruleName,
                  Ids: [reminder.id!],
                })
                .promise()
                .then(() => {
                  console.log("removed targets from ", reminder.id!);
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
                      return err;
                    });
                });

            console.log("Deleted rule?");
            console.log(reminder);

            return reminder;
          });
        },
        async create({ model, operation, args, query }) {
          const reminder = await query(args);

          const assignment = await prisma.assignment.findUnique({
            where: {
              id: reminder.assignmentId,
            },
            include: {
              claimant: {
                select: {
                  phone: true,
                },
              },
              assignedTo: {
                select: {
                  phone: true,
                },
              },
            },
          });

          if (assignment) {
            const dateTime = (assignment.dateTime! as Date).toISOString();
            const dateTimeCron = dateToCron(dateTime);

            const ruleName = `reminder-${reminder.id}`;

            if (process.env.NODE_ENV === "production")
              eventBridge
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
                    const claimantPhone = claimant.phone;

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
            const reminder = assignment.reminder as any as Reminder;

            if (reminder && args.data.dateTime) {
              const dateTime = args.data.dateTime as Date;
              console.log(`setting datetime ${dateTime}`);
              console.log(dateTime);

              const ruleName = `reminder-${reminder.id}`;
              console.log(`ruleName: ${ruleName}`);

              if (process.env.NODE_ENV === "production")
                eventBridge
                  .putRule({
                    Name: ruleName,
                    ScheduleExpression: `cron(${dateToCron(
                      dateTime.toISOString()
                    )})`,
                  })
                  .promise()
                  .then((res) => {
                    console.log("updated rule");
                    console.log(res);
                  })
                  .catch((err) => {
                    console.log("failed to update rule");
                    console.log(err);
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

const datasource = getAppDataSource() as PrismaClient;
export default datasource;
