import { extendType, nonNull } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";

export const GetClaimants = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("getClaimants", {
      type: nonNull("GetClaimantsResponse"),
      authorize: async (_root, _args, ctx) => await isAuthorized(ctx),
      args: { input: nonNull("PaginatedInput") },
      async resolve(_, { input }, { prisma, user }) {
        const { page, countPerPage } = input;

        // todo: instead of having a nested query, modify the prisma schema such that Claimants and claimants are
        // also stored on the user table via relations as well
        const claimants = await prisma.claimant.findMany({
          where: {
            userId: user.id,
          },
          include: {
            assignment: true,
          },
          skip: (page - 1) * countPerPage,
          take: countPerPage,
        });

        const totalRowCount = await prisma.claimant.count({
          where: {
            userId: user.id,
          },
        });

        return { claimants, totalRowCount };
      },
    });
  },
});
