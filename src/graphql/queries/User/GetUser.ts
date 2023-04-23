import { extendType } from "nexus";
import { Context } from "../../schema/context";
import { isAuthorized } from "../../../utils/auth/isAuthorized";

export const GetUser = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("getUser", {
      type: "User",
      authorize: async (root, args, ctx) => await isAuthorized(ctx),
      async resolve(_root, args, { user }: Context) {
        if (!user) throw new Error("No user found");

        return user;
      },
    });
  },
});
