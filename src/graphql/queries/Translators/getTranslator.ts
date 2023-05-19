import { extendType, list, nonNull } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";
import { ByEmail } from "../../types";

export const getTranslator = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("getTranslator", {
      type: "User",
      authorize: async (_root, _args, ctx) => await isAuthorized(ctx),
      args: { input: nonNull(ByEmail) },
      async resolve(_, { input }, { prisma, user: ctxUser }) {
        const { email } = input;
        const { id } = ctxUser!;

        const user = await prisma.user.findFirst({
          where: {
            id,
          },
          include: {
            translators: {
              where: {
                email,
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
