import { extendType, nonNull } from "nexus";
import { CreateClaimantInput } from "../../types";
import { isAuthorized } from "../../../utils/auth/isAuthorized";

export const CreateClaimant = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createClaimant", {
      type: "Claimant",
      authorize: async (_root, _args, ctx) => await isAuthorized(ctx),
      args: {
        input: nonNull(CreateClaimantInput),
      },
      async resolve(_, { input }, { prisma, user }) {
        const {
          email,
          firstName,
          lastName,
          phone,
          languages,
          primaryLanguage,
        } = input;

        if (!email) throw new Error("Email required");

        const claimant = await prisma.claimant.create({
          data: {
            email,
            firstName,
            lastName,
            phone,
            languages: languages ?? [],
            primaryLanguage,
            user: {
              connect: {
                id: user.id,
              },
            },
          },
        });

        return claimant;
      },
    });
  },
});
