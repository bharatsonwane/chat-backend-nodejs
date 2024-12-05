import dotenv from "dotenv";

dotenv.config();

export const envVariable = {
  port: 8000,
  swaggerPort: "localhost:8000",

  // database
  dbHost: process.env.DB_HOST,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  dbPort: process.env.DB_PORT,
};
