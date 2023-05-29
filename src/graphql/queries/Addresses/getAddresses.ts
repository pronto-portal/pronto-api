import { extendType, list, nonNull } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";

export const GetAddresses = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("getAddresses", {
      type: list("Address"),
      authorize: async (_root, _args, ctx) => await isAuthorized(ctx),
      args: { input: nonNull("PaginatedInput") },
      async resolve(_, { input }, { prisma, user }) {
        const { page, countPerPage } = input;

        // todo: instead of having a nested query, modify the prisma schema such that addresses and claimants are
        // also stored on the user table via relations as well
        const addresses = await prisma.address.findMany({
          where: {
            userId: user.id,
          },
          include: {
            assignment: true,
          },
          skip: (page - 1) * countPerPage,
          take: countPerPage,
        });

        return addresses;
      },
    });
  },
});
