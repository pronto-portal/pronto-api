import { booleanArg, mutationType, nonNull, stringArg } from "nexus";
import { Context } from "../schema/context";
import { UserType } from "../types";

export const UserMutations = mutationType({
  definition(t) {
    t.nonNull.field("createUser", {
      type: UserType,
      args: {
        email: nonNull(stringArg()),
        phone: nonNull(stringArg()),
        firstName: nonNull(stringArg()),
        lastName: nonNull(stringArg()),
        profilePic: nonNull(stringArg({ default: "" })),
        isManager: nonNull(booleanArg({ default: false })),
        isTranslator: nonNull(booleanArg({ default: false })),
      },
      async resolve(_root, args, ctx: Context) {
        const user = await ctx.prisma.user.create({
          data: args,
        });

        return user;
      },
    });
  },
});
