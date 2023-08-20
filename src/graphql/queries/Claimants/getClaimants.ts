import { extendType, nonNull, nullable } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";

export const GetClaimants = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("getClaimants", {
      type: nonNull("GetClaimantsResponse"),
      authorize: async (_root, _args, ctx) => await isAuthorized(ctx),
      args: {
        input: nonNull("PaginatedInput"),
        where: nullable("ClaimantsFilter"),
      },
      async resolve(_, { input, where }, { prisma, user }) {
        const { page, countPerPage } = input;

        // todo: test reminders filtering by date
        const claimants = await prisma.claimant.findMany({
          where: {
            userId: user.id,
            ...(where
              ? {
                  firstName: {
                    equals: where.firstName || undefined,
                  },
                  lastName: {
                    equals: where.lastName || undefined,
                  },
                  languages: {
                    has: where.language,
                  },
                }
              : {}),
          },
          include: {
            assignment: true,
          },
          skip: page * countPerPage,
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
