import { Address } from "@prisma/client";
import { objectType } from "nexus";
import { Context } from "../../../schema/context";
import { AssignmentType } from "../Assignments/Assignment";
import { UserType } from "../User/User";

export const AddressType = objectType({
  name: "Address",
  definition(t) {
    t.string("id");
    t.string("address1");
    t.string("address2");
    t.string("city");
    t.string("state");
    t.string("zipCode");
    t.string("userId");
    t.field("user", {
      type: UserType,
      async resolve(root, __, { prisma }) {
        const user = await prisma.user.findUniqueOrThrow({
          where: {
            id: root.userId,
          },
        });

        return user;
      },
    }),
      t.list.field("assignment", {
        type: AssignmentType,
        async resolve(root: Address, __, { prisma }: Context) {
          const { assignment } = await prisma.address.findUniqueOrThrow({
            where: { id: root.id },
            include: {
              assignment: {
                include: {
                  createdBy: true,
                },
              },
            },
          });

          return assignment;
        },
      });
  },
});
