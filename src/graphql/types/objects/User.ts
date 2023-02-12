import { list, nullable, objectType } from "nexus";
import { Context } from "../../schema/context";
import { AssignmentType } from "./Assignment";

export const UserType = objectType({
  name: "User",
  definition(t) {
    t.nonNull.string("id");
    t.date("createdAt");
    t.date("updatedAt");
    t.string("email");
    t.string("phone");
    t.string("firstName");
    t.string("lastName");
    t.string("profilePic");
    t.boolean("isManager");
    t.boolean("isTranslator");
    t.boolean("isBanned");
    t.field("assignments", {
      type: list(nullable(AssignmentType)),
      async resolve(root, __, { prisma }: Context) {
        const { assignments } = await prisma.user.findUniqueOrThrow({
          where: {
            id: root.id,
          },
          include: {
            assignments: true,
          },
        });

        return assignments;
      },
    });
    t.field("assignedTo", {
      type: list(nullable(AssignmentType)),
      async resolve(root, __, { prisma }: Context) {
        const { assignedTo } = await prisma.user.findUniqueOrThrow({
          where: {
            id: root.id,
          },
          include: {
            assignedTo: true,
          },
        });

        return assignedTo;
      },
    });
  },
});
