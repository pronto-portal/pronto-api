import { extendType, nonNull, nullable } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";
import { GetTranslatorsResponse } from "../../types/objects/Translators/GetTranslators";

export const GetTranslators = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("getTranslators", {
      type: nonNull(GetTranslatorsResponse),
      authorize: async (_root, _args, ctx) => await isAuthorized(ctx),
      args: {
        input: nullable("PaginatedInput"),
        where: nullable("TranslatorsFilter"),
      },
      async resolve(_, { input, where }, { prisma, user: ctxUser }) {
        const { id } = ctxUser!;

        const user = await prisma.user.findFirst({
          where: {
            id,
          },
          include: {
            translators: {
              where: where
                ? {
                    ...(where.languages
                      ? {
                          languages: {
                            hasSome: where.languages,
                          },
                        }
                      : {}),
                    id: {
                      equals: where.id || undefined,
                    },
                    phone: {
                      equals: where.phone || undefined,
                    },
                    email: {
                      equals: where.email || undefined,
                    },
                    city: {
                      equals: where.city || undefined,
                    },
                    state: {
                      equals: where.state || undefined,
                    },
                    firstName: {
                      equals: where.firstName || undefined,
                    },
                    lastName: {
                      equals: where.lastName || undefined,
                    },
                  }
                : {},

              ...(input
                ? {
                    skip: input.page * input.countPerPage,
                    take: input.countPerPage,
                  }
                : {}),
            },
          },
        })!;

        const { translators } = user!;

        const totalRowCount = await prisma.user.count({
          where: {
            translatingFor: {
              some: {
                id: ctxUser.id,
              },
            },
          },
          ...(user!.roleName === "Unlimited"
            ? {}
            : {
                take: user!.roleName === "Basic" ? 10 : 50,
              }),
        });

        return { translators, totalRowCount };
      },
    });
  },
});
