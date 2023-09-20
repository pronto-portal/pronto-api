import { extendType, nonNull } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";
import { ById } from "../../types";

export const getNonUserTranslator = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("getNonUserTranslator", {
      type: "Translator",
      authorize: async (_root, _args, ctx) => await isAuthorized(ctx),
      args: {
        input: nonNull(ById),
      },
      async resolve(_, { input }, { prisma, user }) {
        const { id } = input;

        const translator = await prisma.nonUserTranslator.findUnique({
          where: {
            id,
            createdById: user.id,
          },
        });

        if (!translator) {
          throw new Error("Translator not found");
        }

        return translator;
      },
    });
  },
});
