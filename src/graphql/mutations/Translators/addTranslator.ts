import { extendType, nonNull } from "nexus";
import { AddTranslatorInput, UserType } from "../../types";
import { isAuthorized } from "../../../utils/auth/isAuthorized";

export const AddTranslator = extendType({
  type: "Mutation",
  definition(t) {
    t.nullable.field("addTranslator", {
      type: UserType,
      authorize: async (_root, _args, ctx) => await isAuthorized(ctx),
      args: {
        input: nonNull(AddTranslatorInput),
      },
      async resolve(_, { input }, { prisma, user }) {
        const { email } = input;

        const addTranslator = await prisma.user.update({
          where: {
            email,
          },
          data: {
            translatingFor: {
              connect: [{ id: user.id }],
            },
          },
        });

        return addTranslator;
      },
    });
  },
});
