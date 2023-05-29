import { extendType, nonNull } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";

export const DeleteAssignment = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("deleteAssignment", {
      type: "Assignment",
      authorize: async (_, __, ctx) => await isAuthorized(ctx),
      args: {
        input: nonNull("ByIdInput"),
      },
      async resolve(_, { input }, { prisma, user }) {
        const { id } = input;

        const assignment = await prisma.assignment.delete({
          where: {
            id,
            createdByUserId: user.id,
          },
        });

        return assignment;
      },
    });
  },
});
