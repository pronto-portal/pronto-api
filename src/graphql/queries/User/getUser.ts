import { extendType } from "nexus";
import { Context } from "../../schema/context";
import { isAuthorized } from "../../../utils/auth/isAuthorized";

export const GetUser = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("getUser", {
      type: "User",
      authorize: async (root, args, ctx) => await isAuthorized(ctx),
      async resolve(_root, args, { user, prisma }: Context) {
        const dbUser = await prisma.user.findUnique({
          where: {
            id: user.id,
          },
        });

        if (!dbUser) throw new Error("User not found!");

        return dbUser;
      },
    });
  },
});
