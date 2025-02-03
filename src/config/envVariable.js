import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envVariableSchema = z.object({
  /* server */
  NODE_ENV: z.string(),
  API_HOST: z.string(),
  API_PORT: z.number(),

  /* database */
  DB_HOST: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  DB_PORT: z.number(),
});

const getEnvVariable = () => {
  try {
    const environmentVariable = {
      /* server */
      NODE_ENV: process.env.NODE_ENV,
      API_HOST: process.env.API_HOST,
      API_PORT: Number(process.env.API_PORT),

      /* database */
      DB_HOST: process.env.DB_HOST || "localhost",
      DB_USER: process.env.DB_USER || "postgres",
      DB_PASSWORD: process.env.DB_PASSWORD || "Root@3",
      DB_NAME: process.env.DB_NAME || "chat",
      DB_PORT: Number(process.env.DB_PORT) || 5432,
    };

    envVariableSchema.parse(environmentVariable);
    return environmentVariable;
  } catch (error) {
    console.error(error);
    throw new Error("Environment variable validation failed");
  }
};

export const envVariable = getEnvVariable();
