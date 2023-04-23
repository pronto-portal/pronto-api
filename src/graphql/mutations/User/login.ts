import { extendType, nonNull } from "nexus";
import { authenticate } from "../../../utils/auth/authenticate";
import { Context } from "../../schema/context";
import { CreateUserInput, UserType } from "../../types";

export const Login = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("login", {
      type: UserType,
      args: {
        input: nonNull(CreateUserInput),
      },
      async resolve(_root, { input }, ctx: Context) {
        const user = await authenticate(ctx, input);
        return user;
      },
    });
  },
});