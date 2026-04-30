import path from "path";
import { config } from "dotenv";

config({ path: path.resolve(__dirname, "../server/.env") });

import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});