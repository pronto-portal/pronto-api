import { extendType, nonNull } from "nexus";
import { ById } from "../../types";
import { isAuthorized } from "../../../utils/auth/isAuthorized";

export const deleteNonUserTranslator = extendType({
  type: "Mutation",
  definition(t) {
    t.nullable.field("deleteNonUserTranslator", {
      type: "Translator",
      authorize: async (_root, _args, ctx) => await isAuthorized(ctx),
      args: {
        input: nonNull(ById),
      },
      async resolve(_, { input }, { prisma, user }) {
        const { id } = input;
        const deleteTranslator = await prisma.nonUserTranslator.delete({
          where: {
            id,
            createdById: user.id,
          },
        });
        return deleteTranslator;
      },
    });
  },
});
