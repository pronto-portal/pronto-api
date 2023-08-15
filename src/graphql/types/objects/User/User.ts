import { list, nullable, objectType } from "nexus";
import { Context } from "../../../schema/context";
import { AssignmentType } from "../Assignments/Assignment";

export const UserType = objectType({
  name: "User",
  definition(t) {
    t.nonNull.string("id");
    t.date("createdAt");
    t.date("updatedAt");
    t.nonNull.string("email");
    t.nullable.string("phone");
    t.nullable.string("firstName");
    t.nullable.string("lastName");
    t.nullable.string("profilePic");
    t.boolean("isManager");
    t.boolean("isTranslator");
    t.boolean("isBanned");
    t.boolean("isProfileComplete");
    t.nullable.string("city");
    t.nullable.string("state");
    t.list.string("languages");
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
    t.list.field("translators", {
      type: "Translator",
      resolve: async (root, _args, { prisma }) => {
        // Implement your logic for fetching translators here.
        return await prisma.user
          .findUnique({ where: { id: root.id } })
          .translators({
            select: {
              id: true,
              firstName: true,
              lastName: true,
              languages: true,
              email: true,
              phone: true,
            },
          });
      },
    });

    t.list.field("translatingFor", {
      type: "User",
      resolve: async (root, _args, { prisma }) => {
        // Implement your logic for fetching translatingFor here.
        return await prisma.user
          .findUnique({ where: { id: root.id } })
          .translatingFor();
      },
    });
  },
});
