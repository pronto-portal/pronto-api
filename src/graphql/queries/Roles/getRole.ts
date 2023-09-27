import { extendType, nonNull } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";

export const getRole = extendType({
  type: "Query",
  definition(t) {
    t.field("getRole", {
      type: "Role",
      authorize: async (_root, _args, ctx) => await isAuthorized(ctx),
      args: {
        input: nonNull("ByIdInput"),
      },
      resolve: async (_, { input }, { prisma }) => {
        const role = await prisma.role.findUnique({
          where: {
            name: input.id,
          },
        });

        return role;
      },
    });
  },
});
