import logger from "../helper/logger.js";
import db from "./db.js";

const main = async () => {
  await db.migrateDatabases();
};

main()
  .then(() => {
    logger.log("Migration done");
  })
  .catch((err) => {
    logger.error("Migration failed", err);
  });
