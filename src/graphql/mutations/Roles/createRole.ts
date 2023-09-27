import { extendType } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";

export const CreateRole = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createRole", {
      type: "Role",
      args: {
        input: "CreateRoleInput",
      },
      authorize: async (_root, _args, ctx) => await isAuthorized(ctx, "admin"),
      resolve: async (_, { input }, { prisma }) => {
        const role = await prisma.role.create({
          data: {
            name: input.name,
            priceCents: input.priceCents,
          },
        });

        return role;
      },
    });
  },
});
