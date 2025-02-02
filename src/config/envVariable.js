import dotenv from "dotenv";

dotenv.config();

export const envVariable = {
  port: 8000,
  swaggerPort: "localhost:8000",

  // database
  dbHost: process.env.DB_HOST || 'localhost' ,
  dbUser: process.env.DB_USER || 'postgres',
  dbPassword: process.env.DB_PASSWORD || 'Root@3',
  dbName: process.env.DB_NAME || 'chat',
  dbPort: process.env.DB_PORT || 5432,
};


console.log("envVariable", envVariable)