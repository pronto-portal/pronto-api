import { extendType, nonNull } from "nexus";
import { Context } from "../../schema/context";
import { isAuthorized } from "../../../utils/auth/isAuthorized";
import { deleteRule } from "../../../utils/helper/deleteRule";
import { createRule } from "../../../utils/helper/createRule";
import { dateToCron } from "../../../utils/helper/dateToCron";

export const ToggleAssignmentCancellation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("toggleAssignmentCancellation", {
      type: "Assignment",
      authorize: async (_root, _args, ctx) => await isAuthorized(ctx),
      args: {
        input: nonNull("ByIdInput"),
      },
      async resolve(_, { input }, { prisma, user }: Context) {
        const { id: assignmentId } = input;

        const assignment = await prisma.assignment.findUnique({
          where: { id: assignmentId, createdByUserId: user.id },
          include: {
            reminder: true,
            assignedTo: true,
            claimant: true,
          },
        });

        if (!assignment) {
          throw new Error("Assignment not found");
        }

        const reminder = assignment.reminder;
        const assignedTo = assignment.assignedTo;
        const claimant = assignment.claimant;

        const updatedAssignment = await prisma.assignment
          .update({
            where: { id: assignmentId, createdByUserId: user.id },
            data: {
              isCancelled: !assignment.isCancelled,
            },
          })
          .then((data) => {
            if (reminder && assignedTo && claimant) {
              if (data.isCancelled)
                deleteRule({
                  reminderId: reminder.id,
                  translatorPhoneNumber: assignedTo.phone || "",
                  claimantPhoneNumber: claimant.phone,
                  translatorMessage: `Your appointment with ${
                    claimant.firstName
                  } ${
                    claimant.lastName
                  } on ${assignment.dateTime.toLocaleDateString()} has been cancelled.`,
                  claimantMessage: `Your translation meeting with ${
                    assignedTo.firstName
                  } ${
                    assignedTo.lastName
                  } on ${assignment.dateTime.toLocaleDateString()} has been cancelled.`,
                  claimantLanguage: claimant.primaryLanguage ?? "en",
                });
              else
                createRule({
                  reminderId: reminder.id,
                  createdById: reminder.createdById,
                  translatorPhoneNumber: assignedTo.phone || "",
                  claimantPhoneNumber: claimant.phone,
                  translatorMessage: reminder.translatorMessage,
                  claimantMessage: reminder.claimantMessage,
                  claimantLanguage: claimant.primaryLanguage ?? "en",
                  cronString: dateToCron(assignment.dateTime.toISOString()),
                  assignmentDate: assignment.dateTime,
                });
            }

            return data;
          });

        return updatedAssignment;
      },
    });
  },
});
