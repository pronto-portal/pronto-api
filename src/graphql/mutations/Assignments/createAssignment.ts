import { extendType, nonNull } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";
import { CreateAssignmentInput } from "../../types";

export const CreateAssignment = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createAssignment", {
      type: "Assignment",
      authorize: async (_root, _args, ctx) => await isAuthorized(ctx),
      args: {
        input: nonNull(CreateAssignmentInput),
      },
      async resolve(_, { input }, { prisma, user }) {
        const { claimantId, addressId, translatorId, dateTime } = input;
        // todo: modify context type to remove nullable user since user is guaranteed to
        // exist due to authorize middleware. user shouldn't be accesible if a resolver
        // does not have authorizer middleware implemented.
        if (!user) throw new Error("No user found");

        console.log("Create Assignment Date Time", dateTime);

        const assignment = await prisma.assignment.create({
          data: {
            claimant: {
              connect: { id: claimantId },
            },
            address: {
              connect: { id: addressId },
            },
            assignedTo: {
              connect: { id: translatorId },
            },
            dateTime,
            createdBy: {
              connect: { id: user.id },
            },
          },
        });

        return assignment;
      },
    });
  },
});
