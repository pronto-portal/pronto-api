import { extendType, nonNull } from "nexus";
import { CreateAddressInput } from "../../types";
import { isAuthorized } from "../../../utils/auth/isAuthorized";

export const CreateAddress = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createAddress", {
      type: "Address",
      authorize: async (_root, _args, ctx) => await isAuthorized(ctx),
      args: {
        input: nonNull(CreateAddressInput),
      },
      async resolve(_, { input }, { prisma, user }) {
        const { address1, address2, city, state, zipCode } = input;

        const address = await prisma.address.create({
          data: {
            address1,
            address2,
            city,
            state,
            zipCode,
            user: {
              connect: {
                id: user.id,
              },
            },
          },
        });

        return address;
      },
    });
  },
});
