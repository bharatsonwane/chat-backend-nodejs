//@ts-ignore
import Postgrator from "postgrator";
import pg from "pg";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { envVariable } from "../config/envVariable.js";
import logger from "../helper/logger.js";

const { Pool } = pg;

let pool = null;
let client = null;

const getDbPool = () => {
  if (pool) {
    return pool;
  }
  pool = new Pool({
    host: envVariable.DB_HOST,
    port: envVariable.DB_PORT,
    database: envVariable.DB_NAME,
    user: envVariable.DB_USER,
    password: envVariable.DB_PASSWORD,
  });
  return pool;
};

export const executeQuery = async (text, params) => {
  try {
    const pool = getDbPool();
    const client = await pool.connect();
    const result = await client.query(text, params);
    return result.rows; // Return only the rows for convenience
  } catch (error) {
    logger.error("Database Query Error:", error);
    throw error;
  } finally {
    // client.release();
  }
};

export const getDbClient = async () => {
  if (client) {
    return client;
  }
  client = new pg.Client({
    host: envVariable.DB_HOST,
    port: envVariable.DB_PORT,
    database: envVariable.DB_NAME,
    user: envVariable.DB_USER,
    password: envVariable.DB_PASSWORD,
  });
  return client;
};

export const migrateDatabases = async () => {
  try {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const client = await getDbClient();

    await client.connect();

    const postgrator = new Postgrator({
      migrationPattern: __dirname + "/migrations/*",
      driver: "pg",
      database: envVariable.DB_NAME,
      schemaTable: "migration_version",
      execQuery: (query) => client.query(query),
    });

    const databaseVersion = await postgrator.getDatabaseVersion();
    const maxVersion = await postgrator.getMaxVersion();
    await postgrator.migrate();
  } catch (error) {
    logger.error("Migration failed", error);
    throw error;
  }
};
