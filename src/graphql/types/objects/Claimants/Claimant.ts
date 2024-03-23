import { objectType } from "nexus";
import { Context } from "../../../schema/context";
import { AssignmentType } from "../Assignments/Assignment";
import { UserType } from "../User/User";

export const ClaimantType = objectType({
  name: "Claimant",
  definition(t) {
    t.string("id");
    t.string("firstName");
    t.string("lastName");
    t.string("email");
    t.string("phone");
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
        async resolve(root, __, { prisma }: Context) {
          const { assignment } = await prisma.claimant.findUniqueOrThrow({
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
    t.list.string("languages");
    t.string("primaryLanguage");
    t.boolean("optedOut");
  },
});
