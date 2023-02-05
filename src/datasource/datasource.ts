import { PrismaClient } from "@prisma/client";

const getAppDataSource = () => new PrismaClient();

export default getAppDataSource;
