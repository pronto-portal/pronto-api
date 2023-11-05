import { list, objectType } from "nexus";
import { isAuthorized } from "../../../../utils/auth/isAuthorized";

export const RoleType = objectType({
  name: "Role",
  definition(t) {
    t.string("name");
    t.string("description", {
      resolve(root) {
        return root.description;
      },
    });
    t.int("priceCents");
    t.field("users", {
      type: list("User"),
      authorize: async (_root, _args, ctx) => await isAuthorized(ctx, "admin"),
      async resolve(root, __, { prisma }) {
        const users = await prisma.role
          .findUnique({
            where: {
              name: root.name,
            },
          })
          .users();
        return users;
      },
    });
    t.list.nonNull.string("features");
    t.string("stripePriceId", { resolve: (root) => root.stripePriceId });
  },
});
