import * as dotenv from "dotenv";
import { DataSource } from "typeorm";
import Assignment from "../models/Assignment";
import User from "../models/User";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.db_host,
  port: process.env.db_port ? parseInt(process.env.db_port) : 5432,
  username: process.env.db_username,
  password: process.env.db_password,
  database: process.env.db,
  synchronize: true,
  logging: true,
  entities: [User, Assignment],
  subscribers: [],
  migrations: [],
});
