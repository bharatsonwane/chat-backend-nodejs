//@ts-ignore
import Postgrator from "postgrator";
import pg from "pg";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { envVariable } from "../config/envVariable.js";
import logger from "../helper/logger.js";

const { Pool, Client } = pg;

class Database {
  constructor() {
    this.pool = null;
    this.client = null;
  }

  getDbPool() {
    if (!this.pool) {
      this.pool = new Pool({
        host: envVariable.DB_HOST,
        port: envVariable.DB_PORT,
        database: envVariable.DB_NAME,
        user: envVariable.DB_USER,
        password: envVariable.DB_PASSWORD,
        // Add connection pool configuration
        max: 20, // Maximum number of clients in the pool
        idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
        connectionTimeoutMillis: 2000, // How long to wait when connecting a new client
      });

      // Handle pool errors
      this.pool.on("error", (err, client) => {
        logger.error("Unexpected error on idle client", err);
      });
    }
    return this.pool;
  }

  async getDbClient() {
    if (!this.client) {
      this.client = new Client({
        host: envVariable.DB_HOST,
        port: envVariable.DB_PORT,
        database: envVariable.DB_NAME,
        user: envVariable.DB_USER,
        password: envVariable.DB_PASSWORD,
      });
      await this.client.connect();
    }
    return this.client;
  }

  async query(text, params) {
    const client = await this.getDbPool().connect();
    try {
      const result = await client.query(text, params);
      return result.rows;
    } catch (error) {
      logger.error("Database Query Error:", error);
      throw error;
    } finally {
      client.release(true); // true parameter forces the release even if there's an error
    }
  }

  async transaction() {
    const client = await this.getDbPool().connect();
    try {
      await client.query("BEGIN");
      const commit = async () => {
        await client.query("COMMIT");
        client.release(true);
      };
      const rollback = async () => {
        await client.query("ROLLBACK");
        client.release(true);
      };

      return { client, commit, rollback };
    } catch (error) {
      logger.error("Database Transaction Error:", error);
      client.release(true);
      throw error;
    }
  }

  async migrateDatabases() {
    let migrationClient = null;
    try {
      const __dirname = dirname(fileURLToPath(import.meta.url));
      migrationClient = await this.getDbClient();

      const postgrator = new Postgrator({
        migrationPattern: __dirname + "/migrations/*",
        driver: "pg",
        database: envVariable.DB_NAME,
        schemaTable: "migration_version",
        execQuery: (query) => migrationClient.query(query),
      });

      const databaseVersion = await postgrator.getDatabaseVersion();
      const maxVersion = await postgrator.getMaxVersion();
      const migrations = await postgrator.migrate();

      logger.info(`Migration completed. Current version: ${maxVersion}`);
      return migrations;
    } catch (error) {
      logger.error("Migration failed", error);
      throw error;
    } finally {
      if (migrationClient) {
        await migrationClient.end();
      }
    }
  }

  async shutdown() {
    try {
      if (this.client) {
        await this.client.end();
        this.client = null;
      }
      if (this.pool) {
        await this.pool.end();
        this.pool = null;
      }
      logger.info("Database connections closed successfully");
    } catch (error) {
      logger.error("Error during database shutdown:", error);
      throw error;
    }
  }
}

// Create a singleton instance
const db = new Database();

// Handle process termination
process.on("SIGINT", async () => {
  try {
    await db.shutdown();
    process.exit(0);
  } catch (error) {
    logger.error("Error during shutdown:", error);
    process.exit(1);
  }
});

export default db;
