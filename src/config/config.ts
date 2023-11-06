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
  username: process.env.DB_DEVELOPMENT_USERNAME || "",
  password: process.env.DB_DEVELOPMENT_PASSWORD || "",
  database: process.env.DB_DEVELOPMENT_DATABASE || "",
  host: process.env.DB_DEVELOPMENT_HOST || "",
  dialect: process.env.DB_DEVELOPMENT_DIALECT || "mysql",
};

const production: Config = {
  username: process.env.DB_PRODUCTION_USERNAME || "",
  password: process.env.DB_PRODUCTION_PASSWORD || "",
  database: process.env.DB_PRODUCTION_DATABASE || "",
  host: process.env.DB_PRODUCTION_HOST || "",
  dialect: process.env.DB_PRODUCTION_DIALECT || "mysql",
};

const env: "development" | "production" = (process.env.NODE_ENV ||
  "development") as "development" | "production";

const config = { development, production };

export default config[env];
