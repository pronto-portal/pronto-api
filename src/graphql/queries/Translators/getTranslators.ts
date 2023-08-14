import { extendType, nonNull } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";
import { GetTranslatorsResponse } from "../../types/objects/GetTranslators";

export const GetTranslators = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("getTranslators", {
      type: nonNull(GetTranslatorsResponse),
      authorize: async (_root, _args, ctx) => await isAuthorized(ctx),
      args: { input: nonNull("PaginatedInput") },
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

        const totalRowCount = await prisma.user.count({
          where: {
            translatingFor: {
              some: {
                id: ctxUser.id,
              },
            },
          },
        });

        return { translators, totalRowCount };
      },
    });
  },
});
