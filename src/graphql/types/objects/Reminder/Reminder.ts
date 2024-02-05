import { objectType, nullable } from "nexus";

export const ReminderType = objectType({
  name: "Reminder",
  definition(t) {
    t.string("id");
    t.string("claimantMessage");
    t.string("translatorMessage");
    t.field("assignment", {
      type: "Assignment",
      async resolve(root, _, { prisma, user }) {
        const reminder = await prisma.reminder.findUnique({
          where: { id: root.id },
          include: {
            assignment: {
              include: {
                assignedTo: true,
                claimant: true,
              },
            },
          },
        });

        if (!reminder) return null;

        return reminder.assignment;
      },
    });
    t.string("assignmentId");
    t.field("createdBy", {
      type: "User",
      async resolve(root, _, { prisma, user }) {
        const { createdBy } = await prisma.reminder.findUniqueOrThrow({
          where: { id: root.id },
          include: {
            createdBy: true,
          },
        });

        return createdBy;
      },
    });
    t.string("createdById");
    t.nullable.string("cronSchedule", { resolve: (root) => root.cronSchedule });
  },
});
