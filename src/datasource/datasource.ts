import { PrismaClient } from "@prisma/client";
import prisma from "./base";
import { UpdateReminder } from "./helper/reminder/update";
import { DeleteReminder } from "./helper/reminder/delete";
import { CreateReminder } from "./helper/reminder/create";
import { UpdateAssignment } from "./helper/assignment/update";
import { ExpressContextFunctionArgument } from "@apollo/server/dist/esm/express4";

// Reminders are linked to aws event bridge rules via a shared id between a reminder instance and a single event bridge rule
// todo: replace eventbridge read/writes with rule crud util functions

// if no context, default to utc
const getAppDataSource = (context?: ExpressContextFunctionArgument) => {
  const xprisma = prisma.$extends({
    query: {
      reminder: {
        update: (params) => {
          return UpdateReminder({
            ...params,
            localTimeZone: context
              ? (context.req.headers["X-Timezone"] as string)
              : "UTC",
          });
        },
        delete: DeleteReminder,
        create: CreateReminder,
      },
      assignment: {
        update: UpdateAssignment,
      },
    },
  });

  return xprisma;
};

export default getAppDataSource;
