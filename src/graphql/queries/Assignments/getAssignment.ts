import { extendType, list, nonNull } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";

export const getAssignment = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("getAssignment", {
      type: "Assignment",
      authorize: async (_root, _args, ctx) => await isAuthorized(ctx),
      args: { input: nonNull("ByIdInput") },
      async resolve(_, { input }, { prisma, user }) {
        const { id } = input;

        const assignment = await prisma.assignment.findUniqueOrThrow({
          where: {
            id,
            createdByUserId: user.id,
          },
          include: {
            reminder: true,
          },
        });

        return assignment;
      },
    });
  },
});
