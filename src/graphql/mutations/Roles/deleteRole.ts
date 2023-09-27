import { extendType } from "nexus";

export const deleteRole = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("deleteRole", {
      type: "Role",
      args: {
        input: "ByIdInput",
      },
      resolve: async (_, { input }, ctx) => {
        const role = await ctx.prisma.role.delete({
          where: { name: input.id },
        });

        return role;
      },
    });
  },
});
