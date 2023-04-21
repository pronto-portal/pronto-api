import { extendType } from "nexus";
import { Context } from "../../schema/context";
import { isAuthorized } from "../../../utils/auth/isAuthorized";

export const GetUser = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("GetUser", {
      type: "User",
      authorize: async (root, args, ctx) => await isAuthorized(ctx),
      async resolve(_root, args, ctx: Context) {
        if (!ctx.user) throw new Error("No user found");

        return ctx.user;
      },
    });
  },
});
