import { extendType, nonNull } from "nexus";
import { CreateClaimantInput } from "../../types";
import { isAuthorized } from "../../../utils/auth/isAuthorized";
import { TranslateText } from "../../../utils/helper/translateText";
import { sendSMS } from "../../../utils/sendSMS";

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
            languages: languages ?? [],
            primaryLanguage,
            user: {
              connect: {
                id: user.id,
              },
            },
            phoneRef: {
              connectOrCreate: {
                where: {
                  number: phone,
                },
                create: {
                  number: phone,
                },
              },
            },
          },
          include: {
            phoneRef: true,
          },
        });

        if (claimant) {
          let claimantConsentMessage = `You have been added as a claimant to ${user.firstName} ${user.lastName}'s network. Reply YES to receive reminders for your upcoming appointment.`;

          if (claimant.primaryLanguage) {
            claimantConsentMessage = await TranslateText(
              claimantConsentMessage,
              claimant.primaryLanguage
            );
          }

          sendSMS({
            phoneNumber: claimant.phone,
            message: claimantConsentMessage,
            recepientIsOptedOut: claimant.phoneRef?.optedOut || false,
          });
        }

        return claimant;
      },
    });
  },
});
