import { extendType, nonNull } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";

export const UpdateClaimant = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updateClaimant", {
      type: "Claimant",
      args: {
        input: nonNull("UpdateClaimantInput"),
      },
      authorize: async (_, __, ctx) => await isAuthorized(ctx),
      async resolve(_, { input }, { prisma, user }) {
        const {
          id,
          firstName,
          lastName,
          email,
          phone,
          languages,
          primaryLanguage,
        } = input;

        const claimant = await prisma.claimant.update({
          where: { id, userId: user.id },
          data: {
            firstName: firstName || undefined,
            lastName: lastName || undefined,
            email: email || undefined,
            phone: phone || undefined,
            primaryLanguage: primaryLanguage || undefined,
            languages: languages || undefined,
          },
        });

        return claimant;
      },
    });
  },
});
