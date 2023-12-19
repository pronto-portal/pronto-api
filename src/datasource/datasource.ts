import { PrismaClient, Reminder, Role } from "@prisma/client";
import { eventBridge } from "../aws/eventBridge";
import { dateToCron } from "../utils/helper/dateToCron";
import { updateRule } from "../utils/helper/updateRule";
import { createRule } from "../utils/helper/createRule";
import { deleteRule } from "../utils/helper/deleteRule";

// Reminders are linked to aws event bridge rules via a shared id between a reminder instance and a single event bridge rule
// todo: replace eventbridge read/writes with rule crud util functions
const getAppDataSource = () => {
  const prisma = new PrismaClient();

  const xprisma = prisma.$extends({
    query: {
      reminder: {
        async update({ args, query }) {
          return await query({ ...args }).then(async (reminder) => {
            const assignment = await prisma.assignment.findUnique({
              where: {
                id: reminder.assignmentId,
              },
              include: {
                claimant: {
                  select: {
                    phone: true,
                    primaryLanguage: true,
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
              const claimantPhone = assignment.claimant!.phone;

              const translator = assignment.assignedTo;
              const translatorPhone = translator!.phone;

              console.log("Updating rule");
              const translatorMessage =
                args.data.translatorMessage?.toString() ||
                reminder.translatorMessage ||
                "";

              const claimantMessage =
                args.data.claimantMessage?.toString() ||
                reminder.claimantMessage ||
                "";

              await updateRule({
                reminderId: id,
                translatorPhoneNumber: translatorPhone || undefined,
                claimantPhoneNumber: claimantPhone,
                translatorMessage,
                claimantMessage,
                claimantLanguage: assignment.claimant!.primaryLanguage ?? "en",
                dateTime: assignment.dateTime!,
              });

              // todo: when updating translator/claimant phonenumber update the payload of this target
            }

            return reminder;
          });
        },
        async delete({ args, query }) {
          return await query(args).then((reminder) => {
            console.log("Deleting rule");
            if (process.env.NODE_ENV === "production")
              deleteRule({
                reminderId: reminder.id!,
                translatorPhoneNumber: "",
                claimantPhoneNumber: "",
                translatorMessage: "",
                claimantMessage: "",
                claimantLanguage: "en",
                sendSMSUpdate: false,
              });

            console.log("Deleted rule?");
            console.log(reminder);

            return reminder;
          });
        },
        async create({ args, query }) {
          const reminder = await query(args);

          const assignment = await prisma.assignment.findUnique({
            where: {
              id: reminder.assignmentId,
            },
            include: {
              claimant: {
                select: {
                  phone: true,
                  primaryLanguage: true,
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

            console.log("Assignment Date time", assignment.dateTime);
            console.log("Assignment Date time ISO", dateTime);
            console.log("Assignment Date time Cron", dateTimeCron);

            const ruleName = `reminder-${reminder.id}`;

            if (process.env.NODE_ENV === "production")
              createRule({
                reminderId: reminder.id!,
                createdById: reminder.createdById!,
                translatorPhoneNumber: assignment.assignedTo!.phone || "",
                claimantPhoneNumber: assignment.claimant!.phone,
                translatorMessage: reminder.translatorMessage!,
                claimantMessage: reminder.claimantMessage!,
                claimantLanguage: assignment.claimant!.primaryLanguage ?? "en",
                dateTime: assignment.dateTime,
              }).then(({ success }) => {
                if (!success)
                  eventBridge
                    .deleteRule({
                      Name: ruleName,
                    })
                    .promise()
                    .then(() => {
                      prisma.reminder.delete({
                        where: {
                          id: reminder.id,
                        },
                      });
                    });

                // Delete reminder since reminder has not actually been created:
              });
          }

          return reminder;
        },
      },
      assignment: {
        async update({ args, query }) {
          return await query(args).then((assignment) => {
            const reminder = assignment.reminder as any as Reminder;

            if (reminder && args.data.dateTime) {
              const dateTime = args.data.dateTime as Date;
              console.log(`setting datetime ${dateTime}`);
              console.log(dateTime);

              const ruleName = `reminder-${reminder.id}`;
              console.log(`ruleName: ${ruleName}`);

              if (process.env.NODE_ENV === "production")
                updateRule({
                  reminderId: reminder.id!,
                  dateTime: dateTime,
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
