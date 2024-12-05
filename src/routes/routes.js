import express from "express";
import lookupRoutes from "./lookup.routes.js";
import userRoutes from "./user.routes.js";

const routes = express.Router();

routes.use("/lookup", lookupRoutes);
routes.use("/user", userRoutes);

export default routes;
