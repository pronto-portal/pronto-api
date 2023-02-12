import {
  booleanArg,
  extendType,
  mutationType,
  nonNull,
  nullable,
  stringArg,
} from "nexus";
import { Context } from "../../schema/context";
import { UserType } from "../../types";

export const UpdateUser = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createUser", {
      type: UserType,
      args: {
        id: nonNull(stringArg()),
        phone: nullable(stringArg()),
        firstName: nullable(stringArg()),
        lastName: nullable(stringArg()),
        profilePic: nullable(stringArg()),
        isManager: nullable(booleanArg()),
        isTranslator: nullable(booleanArg()),
      },
      async resolve(_root, { id, ...args }, ctx: Context) {
        const user = await ctx.prisma.user.update({
          where: { id },
          data: args,
        });

        return user;
      },
    });
  },
});
