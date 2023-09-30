import { extendType, nonNull, nullable } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";

export const GetClaimants = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("getClaimants", {
      type: nonNull("GetClaimantsResponse"),
      authorize: async (_root, _args, ctx) => await isAuthorized(ctx),
      args: {
        input: nullable("PaginatedInput"),
        where: nullable("ClaimantsFilter"),
      },
      async resolve(_, { input, where }, { prisma, user }) {
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
                  primaryLanguage: {
                    equals: where.primaryLanguage || undefined,
                  },
                }
              : {}),
          },
          include: {
            assignment: true,
          },
          ...(input
            ? {
                skip: input.page * input.countPerPage,
                take: input.countPerPage,
              }
            : {}),
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
