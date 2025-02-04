import express from "express";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import * as lookupController from "../controllers/lookup.controller.js";
import RouteRegistrar from "../helper/RouteRegistrar.js";
import { getLookupListDoc } from "../schemas/lookup.schema.js";

const router = express.Router();
const registrar = new RouteRegistrar(router, {
  basePath: "/lookup",
  tags: ["Lookup"],
});

registrar.get("/", {
  openApiDoc: getLookupListDoc,
  controller: lookupController.retrieveLookupList,
});

export default router;
