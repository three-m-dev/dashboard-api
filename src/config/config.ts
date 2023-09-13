import dotenv from "dotenv";

dotenv.config();

type Config = {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: string;
};

const development: Config = {
  username: process.env.DB_USERNAME_DEVELOPMENT || "root",
  password: process.env.DB_PASSWORD_DEVELOPMENT || "",
  database: process.env.DB_DATABASE_DEVELOPMENT || "",
  host: process.env.DB_HOST_DEVELOPMENT || "",
  dialect: process.env.DB_DIALECT_DEVELOPMENT || "mysql",
};

const test: Config = {
  username: process.env.DB_USERNAME_TEST || "root",
  password: process.env.DB_PASSWORD_TEST || "",
  database: process.env.DB_DATABASE_TEST || "",
  host: process.env.DB_HOST_TEST || "",
  dialect: process.env.DB_DIALECT_TEST || "mysql",
};

const production: Config = {
  username: process.env.DB_USERNAME_PRODUCTION || "root",
  password: process.env.DB_PASSWORD_PRODUCTION || "",
  database: process.env.DB_DATABASE_PRODUCTION || "",
  host: process.env.DB_HOST_PRODUCTION || "",
  dialect: process.env.DB_DIALECT_PRODUCTION || "mysql",
};

const env: "development" | "test" | "production" = (process.env.NODE_ENV ||
  "development") as "development" | "test" | "production";

const config = { development, test, production };

export default config[env];
