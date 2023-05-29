import { extendType, nonNull } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";

export const DeleteAddress = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("deleteAddress", {
      type: "Address",
      authorize: async (_, __, ctx) => await isAuthorized(ctx),
      args: {
        input: nonNull("ByIdInput"),
      },
      async resolve(_, { input }, { prisma, user }) {
        const { id } = input;

        const address = await prisma.address.delete({
          where: {
            id,
            userId: user.id,
          },
        });

        return address;
      },
    });
  },
});
