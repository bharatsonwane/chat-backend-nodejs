import logger from "../helper/logger.js";
import { migrateDatabases } from "./db.js";

const main = async () => {
  await migrateDatabases();
};

main()
  .then(() => {
    logger.log("Migration done");
  })
  .catch((err) => {
    logger.error("Migration failed", err);
  });
