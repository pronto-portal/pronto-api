import { extendType } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";

export const updateRole = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateRole", {
      type: "Role",
      args: {
        input: "UpdateRoleInput",
      },
      authorize: async (_root, _args, ctx) => await isAuthorized(ctx, "admin"),
      resolve: async (_, { input }, { prisma }) => {
        const role = await prisma.role.update({
          where: {
            name: input.name,
          },
          data: {
            name: input.name || undefined,
            priceCents: input.priceCents || undefined,
            description: input.description || undefined,
          },
        });

        return role;
      },
    });
  },
});
