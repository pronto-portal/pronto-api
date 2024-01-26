import { Assignment } from "@prisma/client";
import { objectType } from "nexus";
import { Context } from "../../../schema/context";
import { AddressType } from "../Address/Address";
import { ClaimantType } from "../Claimants/Claimant";
import { UserType } from "../User/User";
import { TranslatorType } from "../Translators/Translator";

export const AssignmentType = objectType({
  name: "Assignment",
  definition(t) {
    t.string("id");
    t.date("createdAt");
    t.field("dateTime", {
      type: "DateTime",
    });
    t.field("assignedToUser", {
      type: UserType,
      async resolve(root, __, { prisma }: Context) {
        const { assignedToUser } = await prisma.assignment.findUniqueOrThrow({
          where: { id: root.id },
          include: {
            assignedToUser: true,
          },
        });

        return assignedToUser;
      },
    });
    t.field("createdBy", {
      type: UserType,
      async resolve(root, __, { prisma }: Context) {
        const { createdBy } = await prisma.assignment.findUniqueOrThrow({
          where: { id: root.id },
          include: {
            createdBy: true,
          },
        });

        return createdBy;
      },
    });
    t.field("claimant", {
      type: ClaimantType,
      async resolve(root: Assignment, __, { prisma }: Context) {
        const { claimant } = await prisma.assignment.findUniqueOrThrow({
          where: { id: root.id },
          include: {
            claimant: true,
          },
        });

        return claimant;
      },
    });
    t.field("address", {
      type: AddressType,
      async resolve(root, __, { prisma }: Context) {
        const { address } = await prisma.assignment.findUniqueOrThrow({
          where: { id: root.id },
          include: {
            address: true,
          },
        });

        return address;
      },
    });
    t.field("assignedTo", {
      type: TranslatorType,
      async resolve(root, __, { prisma }: Context) {
        const { assignedTo } = await prisma.assignment.findUniqueOrThrow({
          where: { id: root.id },
          include: {
            assignedTo: true,
          },
        });

        return assignedTo;
      },
    });
    t.field("assignedToUser", {
      type: TranslatorType,
      async resolve(root, __, { prisma }: Context) {
        const { assignedToUser } = await prisma.assignment.findUniqueOrThrow({
          where: { id: root.id },
          include: {
            assignedToUser: true,
          },
        });

        return assignedToUser;
      },
    });
    t.field("reminder", {
      type: "Reminder",
      async resolve(root, __, { prisma }: Context) {
        const { reminder } = await prisma.assignment.findUniqueOrThrow({
          where: { id: root.id },
          include: {
            reminder: true,
          },
        });

        return reminder;
      },
    });
    t.boolean("isComplete");
    t.boolean("claimantNoShow");
    t.boolean("translatorNoShow");
    t.boolean("isCancelled");
  },
});
