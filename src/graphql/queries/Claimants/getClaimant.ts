import { extendType, list, nonNull } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";
import { ByEmail } from "../../types";

export const getClaimant = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("getClaimant", {
      type: "Claimant",
      authorize: async (_root, _args, ctx) => await isAuthorized(ctx),
      args: { input: nonNull("ByIdInput") },
      async resolve(_, { input }, { prisma, user }) {
        const { id } = input;

        const claimant = await prisma.claimant.findUniqueOrThrow({
          where: { id },
        });

        return claimant;
      },
    });
  },
});
