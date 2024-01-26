import { PrismaClient } from "@prisma/client";
import prisma from "./base";
import { UpdateReminder } from "./helper/reminder/update";
import { DeleteReminder } from "./helper/reminder/delete";
import { CreateReminder } from "./helper/reminder/create";
import { UpdateAssignment } from "./helper/assignment/update";

// Reminders are linked to aws event bridge rules via a shared id between a reminder instance and a single event bridge rule
// todo: replace eventbridge read/writes with rule crud util functions
const getAppDataSource = () => {
  const xprisma = prisma.$extends({
    query: {
      reminder: {
        update: UpdateReminder,
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

const datasource = getAppDataSource() as PrismaClient;
export default datasource;
