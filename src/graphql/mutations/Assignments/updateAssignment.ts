import { extendType, nonNull } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";
import { DynamicUpdate } from "../../../types";
import { UpdateAssignmentInput } from "../../types";
import { dateToCron } from "../../../utils/helper/dateToCron";

export const UpdateAssignment = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updateAssignment", {
      type: "Assignment",
      authorize: async (_root, _args, ctx) => await isAuthorized(ctx),
      args: { input: nonNull(UpdateAssignmentInput) },
      resolve: async (_, { input }, { prisma, user, eventBridge }) => {
        const {
          id,
          translatorId,
          claimantId,
          addressId,
          isComplete,
          claimantNoShow,
          translatorNoShow,
          dateTime,
        } = input;

        let updateData: DynamicUpdate = {
          isComplete: typeof isComplete === "boolean" ? isComplete : undefined,
          claimantNoShow:
            typeof claimantNoShow === "boolean" ? claimantNoShow : undefined,
          translatorNoShow:
            typeof translatorNoShow === "boolean"
              ? translatorNoShow
              : undefined,
          dateTime: dateTime || undefined,
        };

        if (translatorId) {
          updateData = {
            ...updateData,
            assignedTo: {
              connect: {
                id: translatorId,
              },
            },
          };
        }

        if (claimantId) {
          updateData = {
            ...updateData,
            claimant: {
              connect: {
                id: claimantId,
              },
            },
          };
        }

        if (addressId) {
          updateData = {
            ...updateData,
            address: {
              connect: {
                id: addressId,
              },
            },
          };
        }

        // This makes it so that a user cannot modify another user's assignment
        const assignment = await prisma.assignment
          .update({
            where: {
              id,
              createdByUserId: user.id,
            },
            data: updateData,
            include: {
              reminder: true,
            },
          })
          .then((res) => {
            const { reminder } = res;
            if (reminder && dateTime) {
              const ruleName = `reminder-${reminder.id}`;
              eventBridge
                .putRule({
                  Name: ruleName,
                  ScheduleExpression: `cron(${dateToCron(
                    dateTime.toISOString()
                  )})`,
                })
                .promise()
                .then((res) => {
                  console.log(`Successfully updates ${ruleName}`);
                  return res;
                })
                .catch((err) => {
                  console.log(`Error updating ${ruleName}`);
                  console.log(err);
                  return err;
                });
            }
            return res;
          });

        return assignment;
      },
    });
  },
});
