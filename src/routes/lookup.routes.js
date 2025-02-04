import express from "express";

import * as lookupController from "../controllers/lookup.controller.js";
import RouteRegistrar from "../helper/RouteRegistrar.js";
import { getLookupListDoc, getLookupTypeByIdDoc } from "../schemas/lookup.schema.js";

const router = express.Router();
const registrar = new RouteRegistrar(router, {
  basePath: "/lookup",
  tags: ["Lookup"],
});

registrar.get("/list", {
  openApiDoc: getLookupListDoc,
  controller: lookupController.retrieveLookupList,
});

registrar.get("/type/:id", {
  openApiDoc: getLookupTypeByIdDoc,
  controller: lookupController.getLookupTypeById,
});

export default router;
