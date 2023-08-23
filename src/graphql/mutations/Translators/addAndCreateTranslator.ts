import { extendType, nonNull } from "nexus";
import { authenticate } from "../../../utils/auth/authenticate";
import { Context } from "../../schema/context";
import { AddAndCreateTranslatorInput, UserType } from "../../types";
import { create } from "domain";
import { isAuthorized } from "../../../utils/auth/isAuthorized";

export const AddAndCreateTranslator = extendType({
  type: "Mutation",
  definition(t) {
    t.nullable.field("addAndCreateTranslator", {
      type: UserType,
      authorize: async (_root, _args, ctx) => await isAuthorized(ctx),
      args: {
        input: nonNull(AddAndCreateTranslatorInput),
      },
      async resolve(_root, { input }, { prisma, user: ctxUser }: Context) {
        const { email, phone, firstName, lastName, languages, city, state } =
          input;
        if (!ctxUser) throw new Error("No user found");

        const user = await prisma.user.findFirst({
          where: {
            id: ctxUser.id,
          },
          include: {
            translators: {
              select: {
                id: true,
                email: true,
                phone: true,
                firstName: true,
                lastName: true,
                languages: true,
              },
            },
          },
        });

        if (!user) throw new Error("Client user does not match server user");
        // TODO:
        // I need a way to add a translator to a user without creating a new user object.
        // This can be done by storing 2 separate tables of users and translators

        const newTranslator = await prisma.user.upsert({
          where: {
            email,
          },
          create: {
            phone,
            email,
            firstName,
            lastName,
            city,
            state,
            languages: languages ?? [],
            isTranslator: true,
            translatingFor: {
              connect: [{ id: ctxUser.id }],
            },
          },
          update: {
            translatingFor: {
              connect: [{ id: ctxUser.id }],
            },
          },
        });

        return newTranslator;
      },
    });
  },
});
