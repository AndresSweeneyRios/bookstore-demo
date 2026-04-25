import path from "path";
import { defineConfig } from "prisma/config";
import * as dotenv from "dotenv"
import {
  configureEnviroment,
} from "./src/prisma/configureEnvironment"

if (process.env.NODE_ENV !== "production") {
  dotenv.config({
    path: path.join(import.meta.dirname, "../../.env")
  })
}

configureEnviroment()

export default defineConfig({
  schema: path.join("schema.prisma"),
  migrations: {
    path: path.join("db", "migrations"),
  },
  views: {
    path: path.join("db", "views"),
  },
  typedSql: {
    path: path.join("db", "queries"),
  }
});
