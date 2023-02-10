import { Address } from "@prisma/client";
import { objectType } from "nexus";
import { Context } from "../../schema/context";
import { AssignmentType } from "./Assignment";

export const AddressType = objectType({
  name: "Address",
  definition(t) {
    t.string("id");
    t.string("address1");
    t.string("address2");
    t.string("state");
    t.string("zipCode");
    t.field("assignment", {
      type: AssignmentType,
      async resolve(root: Address, __, { prisma }: Context) {
        const { assignment } = await prisma.address.findUniqueOrThrow({
          where: { id: root.id },
          include: {
            assignment: true,
          },
        });

        return assignment;
      },
    });
  },
});
