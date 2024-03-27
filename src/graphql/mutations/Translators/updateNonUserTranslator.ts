import { extendType, nonNull } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";

export const UpdateNonUserTranslator = extendType({
  type: "Mutation",
  definition(t) {
    t.nullable.field("updateNonUserTranslator", {
      type: "Translator",
      authorize: async (_root, _args, ctx) => await isAuthorized(ctx),
      args: {
        input: nonNull("UpdateNonUserTranslatorInput"),
      },
      async resolve(_, { input }, { prisma }) {
        const {
          id,
          email,
          firstName,
          lastName,
          phone,
          languages,
          city,
          state,
        } = input;
        const updateTranslator = await prisma.nonUserTranslator.update({
          where: {
            id,
          },
          data: {
            email: email || undefined,
            firstName: firstName || undefined,
            lastName: lastName || undefined,
            city: city || undefined,
            state: state || undefined,
            languages: languages || undefined,
            phoneRef: phone
              ? {
                  connectOrCreate: {
                    where: {
                      number: phone,
                    },
                    create: {
                      number: phone,
                    },
                  },
                }
              : undefined,
          },
        });
        return updateTranslator;
      },
    });
  },
});
