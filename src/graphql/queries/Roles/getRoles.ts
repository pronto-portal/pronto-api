import { extendType, list } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";

export const getRoles = extendType({
  type: "Query",
  definition(t) {
    t.field("getRoles", {
      type: list("Role"),
      authorize: async (_root, _args, ctx) => await isAuthorized(ctx),
      resolve: async (_, __, { prisma }) => {
        const roles = (await prisma.role.findMany()).sort((a, b) => {
          return a.priceCents - b.priceCents;
        });

        return roles;
      },
    });
  },
});
