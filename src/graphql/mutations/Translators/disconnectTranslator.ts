import { extendType, nonNull } from "nexus";
import { DisconnectTranslatorInput, UserType } from "../../types";
import { isAuthorized } from "../../../utils/auth/isAuthorized";

export const DisconnectTranslator = extendType({
  type: "Mutation",
  definition(t) {
    t.nullable.field("disconnectTranslator", {
      type: UserType,
      authorize: async (_root, _args, ctx) => await isAuthorized(ctx),
      args: {
        input: nonNull(DisconnectTranslatorInput),
      },
      async resolve(_, { input }, { prisma, user }) {
        const { email } = input;
        if (!user) throw new Error("No user found");

        // todo: This may introduce an edge case scenario where a user can reac
        const DisconnectTranslator = await prisma.user.update({
          where: {
            email,
          },
          data: {
            translatingFor: {
              disconnect: [{ id: user.id }],
            },
          },
        });

        return DisconnectTranslator;
      },
    });
  },
});
