import { extendType, nonNull, nullable } from "nexus";
import { isAuthorized } from "../../../utils/auth/isAuthorized";

// todo: test filtering
export const GetAssignments = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("getAssignments", {
      type: nonNull("GetAssignmentsResponse"),
      args: {
        input: nonNull("PaginatedInput"),
        where: nullable("AssignmentsFilter"),
      },
      authorize: async (_, __, ctx) => await isAuthorized(ctx),
      async resolve(_, { input, where }, { prisma, user }) {
        const { page, countPerPage } = input;

        const assignments = await prisma.assignment.findMany({
          where: {
            createdByUserId: user.id,
            ...(where
              ? {
                  claimant: where.claimant
                    ? {
                        firstName: where.claimant.firstName || undefined,
                        lastName: where.claimant.lastName || undefined,
                        languages: {
                          has: where.claimant.language,
                        },
                      }
                    : undefined,
                  address: where.address
                    ? {
                        address1: where.address.address1 || undefined,
                        address2: where.address.address2 || undefined,
                        city: where.address.city || undefined,
                        state: where.address.state || undefined,
                        zipCode: where.address.zipCode || undefined,
                      }
                    : undefined,
                  assignedTo: where.assignedTo
                    ? {
                        ...(where.assignedTo.languages
                          ? {
                              languages: {
                                hasSome: where.assignedTo.languages,
                              },
                            }
                          : {}),
                        city: {
                          equals: where.assignedTo.city,
                        },
                        state: {
                          equals: where.assignedTo.state,
                        },
                        firstName: {
                          equals: where.assignedTo.firstName,
                        },
                        lastName: {
                          equals: where.assignedTo.lastName,
                        },
                      }
                    : undefined,
                  dateTime: where.date
                    ? {
                        equals: where.date,
                      }
                    : where.dateRange
                    ? {
                        gte: where.dateRange.date1,
                        lte: where.dateRange.date2,
                      }
                    : undefined,
                }
              : {}),
          },
          skip: page * countPerPage,
          take: countPerPage,
          include: {
            address: true,
            assignedTo: true,
            createdBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            reminder: true,
          },
        });

        const totalRowCount = await prisma.assignment.count({
          where: { createdByUserId: user.id },
        });

        return { assignments, totalRowCount };
      },
    });
  },
});
