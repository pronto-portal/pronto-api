import { extendType, nonNull } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";

export const UpdateAddress = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updateAddress", {
      type: "Address",
      args: {
        input: nonNull("UpdateAddressInput"),
      },
      authorize: async (_, __, ctx) => await isAuthorized(ctx),
      async resolve(_, { input }, { prisma, user }) {
        const { id, address1, address2, city, state, zipCode } = input;

        const address = await prisma.address.update({
          where: { id, userId: user.id },
          data: {
            address1: address1 || undefined,
            address2: address2 || undefined,
            city: city || undefined,
            state: state || undefined,
            zipCode: zipCode || undefined,
          },
        });

        return address;
      },
    });
  },
});
