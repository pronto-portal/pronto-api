import { extendType, nonNull } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";
import { sendSMS } from "../../../utils/sendSMS";

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

        const translator = await prisma.nonUserTranslator.create({
          data: {
            email,
            createdBy: {
              connect: {
                id: user.id,
              },
            },
            firstName,
            lastName,
            city,
            state,
            languages: languages || [],
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

        if (translator && translator.phone) {
          console.log("translator.phoneRef", translator.phoneRef);
          console.log(
            "translator.phoneRef.dateTimeOptedOut",
            translator.phoneRef?.dateTimeOptedOut
          );

          if (translator.phoneRef && !translator.phoneRef.dateTimeOptedOut) {
            console.log(
              "Translator has never initially opted out therefore this is the first time they are being added to the network."
            );
            sendSMS({
              phoneNumber: translator.phone,
              message: `You have been added as a translator to ${user.firstName} ${user.lastName}'s network. Reply YES to receive reminders for your assignments.`,
              recepientIsOptedOut: false,
            });
          }
        }

        return translator;
      },
    });
  },
});
