import { extendType, list, nonNull } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";

export const getAddress = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("getAddress", {
      type: "Address",
      authorize: async (_root, _args, ctx) => await isAuthorized(ctx),
      args: { input: nonNull("ByIdInput") },
      async resolve(_, { input }, { prisma }) {
        const { id } = input;

        const address = await prisma.address.findUniqueOrThrow({
          where: {
            id,
          },
        });

        return address;
      },
    });
  },
});
