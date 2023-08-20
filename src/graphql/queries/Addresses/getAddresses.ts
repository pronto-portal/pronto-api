import { extendType, nonNull, nullable } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";

export const GetAddresses = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("getAddresses", {
      type: nonNull("GetAddressesResponse"),
      authorize: async (_root, _args, ctx) => await isAuthorized(ctx),
      args: {
        input: nonNull("PaginatedInput"),
        where: nullable("AddressesFilter"),
      },
      async resolve(_, { input, where }, { prisma, user }) {
        const { page, countPerPage } = input;

        // todo: instead of having a nested query, modify the prisma schema such that addresses and claimants are
        // also stored on the user table via relations as well
        const addresses = await prisma.address.findMany({
          where: {
            userId: user.id,
            ...(where
              ? {
                  address1: {
                    equals: where.address1 || undefined,
                  },
                  address2: {
                    equals: where.address2 || undefined,
                  },
                  city: {
                    equals: where.city || undefined,
                  },
                  state: {
                    equals: where.state || undefined,
                  },
                  zipCode: {
                    equals: where.zipCode || undefined,
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

        const totalRowCount = await prisma.address.count({
          where: {
            userId: user.id,
          },
        });

        return { addresses, totalRowCount };
      },
    });
  },
});
