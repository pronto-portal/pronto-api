import { list, objectType } from "nexus";
import { Context } from "../../../schema/context";

export const TranslatorType = objectType({
  name: "Translator",
  definition(t) {
    t.string("id");
    t.date("createdAt");
    t.date("updatedAt");
    t.string("firstName");
    t.string("lastName");
    t.field("assignedTo", {
      type: list("Assignment"),
      async resolve(root, __, { prisma }: Context) {
        if (root && root.id) {
          const translator = await prisma.nonUserTranslator.findUniqueOrThrow({
            where: {
              id: root.id,
            },
            include: {
              assignedTo: true,
            },
          });

          const assignedTo = translator.assignedTo;
          return assignedTo;
        }

        return [];
      },
    });
    t.string("email");
    t.string("phone");
    t.string("city");
    t.string("state");
    t.list.nonNull.string("languages");
    t.boolean("optedOut");
  },
});
