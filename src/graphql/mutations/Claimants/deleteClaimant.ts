import { extendType, nonNull } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";

export const DeleteClaimant = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("deleteClaimant", {
      type: "Claimant",
      authorize: async (_, __, ctx) => await isAuthorized(ctx),
      args: {
        input: nonNull("ByIdInput"),
      },
      async resolve(_, { input }, { prisma, user }) {
        const { id } = input;

        const claimant = await prisma.claimant.delete({
          where: {
            id,
            userId: user.id,
          },
        });

        return claimant;
      },
    });
  },
});
