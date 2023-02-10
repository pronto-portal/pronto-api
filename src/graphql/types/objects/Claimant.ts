import { objectType } from "nexus";
import { Context } from "../../schema/context";
import { AssignmentType } from "./Assignment";

export const ClaimantType = objectType({
  name: "Claimant",
  definition(t) {
    t.string("id");
    t.string("firstName");
    t.string("lastName");
    t.string("email");
    t.field("assignment", {
      type: AssignmentType,
      async resolve(root, __, { prisma }: Context) {
        const { assignment } = await prisma.claimant.findUniqueOrThrow({
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
