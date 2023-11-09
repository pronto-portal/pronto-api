import { extendType, nonNull } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";

export const AddNonUserTranslator = extendType({
  type: "Mutation",
  definition(t) {
    t.nullable.field("addNonUserTranslator", {
      type: "Translator",
      authorize: async (_root, _args, ctx) =>
        await isAuthorized(ctx, "basic", true, "translators"),
      args: {
        input: nonNull("AddNonUserTranslatorInput"),
      },
      async resolve(_, { input }, { prisma, user }) {
        const { email, firstName, lastName, phone, languages, city, state } =
          input;

        const addTranslator = await prisma.nonUserTranslator.create({
          data: {
            email,
            createdBy: {
              connect: {
                id: user.id,
              },
            },
            firstName,
            lastName,
            phone,
            city,
            state,
            languages: languages || [],
          },
        });

        return addTranslator;
      },
    });
  },
});
