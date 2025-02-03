import { migrateDatabases } from "./db.js";

const main = async () => {
    await migrateDatabases();
}

main().then(() => {
    console.log("Migration done");
}).catch((err) => {
    console.error("Migration failed", err);
});