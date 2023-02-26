import { extendType, nonNull } from "nexus";
import { authenticate } from "../../../utils/auth/authenticate";
import { Context } from "../../schema/context";
import { CreateUserInput, UserType } from "../../types";

export const CreateUser = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createUser", {
      type: UserType,
      args: {
        input: nonNull(CreateUserInput),
      },
      async resolve(_root, { input }, ctx: Context) {
        const user = await ctx.prisma.user.create({
          data: input,
        });

        authenticate(user, ctx);

        return user;
      },
    });
  },
});
