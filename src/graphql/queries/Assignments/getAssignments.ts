import { extendType, list, nonNull } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";

export const GetAssignments = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("getAssignments", {
      type: list("Assignment"),
      args: { input: nonNull("PaginatedInput") },
      authorize: async (_, __, ctx) => await isAuthorized(ctx),
      async resolve(_, { input }, { prisma, user }) {
        const { page, countPerPage } = input;

        const assignments = await prisma.assignment.findMany({
          where: { createdByUserId: user.id },
          skip: (page - 1) * countPerPage,
          take: countPerPage,
          include: {
            address: true,
            assignedTo: true,
            createdBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            reminder: true,
          },
        });

        return assignments;
      },
    });
  },
});
