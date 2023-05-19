import { extendType, list, nonNull } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";

export const GetTranslators = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("getTranslators", {
      type: list("User"),
      authorize: async (_root, _args, ctx) => await isAuthorized(ctx),
      args: { input: nonNull("Paginated") },
      async resolve(_, { input }, { prisma, user: ctxUser }) {
        const { page, countPerPage } = input;
        const { id } = ctxUser!;

        const user = await prisma.user.findFirst({
          where: {
            id,
          },
          include: {
            translators: {
              skip: (page - 1) * countPerPage,
              take: countPerPage,
            },
          },
        });

        const { translators } = user!;

        return translators;
      },
    });
  },
});
