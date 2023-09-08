import { extendType, nonNull } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";
import { ById } from "../../types";

export const getTranslator = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("getTranslator", {
      type: "User",
      authorize: async (_root, _args, ctx) => await isAuthorized(ctx),
      args: { input: nonNull(ById) },
      async resolve(_, { input }, { prisma, user: ctxUser }) {
        const { id } = ctxUser!;
        const { id: translatorId } = input;

        const user = await prisma.user.findFirst({
          where: {
            id,
          },
          include: {
            translators: {
              where: {
                id: translatorId,
              },
            },
          },
        });

        const {
          translators: [translator],
        } = user!;

        return translator;
      },
    });
  },
});
