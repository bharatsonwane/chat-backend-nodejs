import express from "express";

import {
  retrieveLookupList,
  getLookupTypeById,
} from "../controllers/lookup.controller.js";
import RouteRegistrar from "../middleware/RouteRegistrar.js";
import {
  getLookupListDoc,
  getLookupTypeByIdDoc,
} from "../schemas/lookup.schema.js";

const router = express.Router();
const registrar = new RouteRegistrar(router, {
  basePath: "/lookup",
  tags: ["Lookup"],
});

registrar.get("/list", {
  openApiDoc: getLookupListDoc,
  controller: retrieveLookupList,
});

registrar.get("/type/:id", {
  openApiDoc: getLookupTypeByIdDoc,
  controller: getLookupTypeById,
});

export default router;
