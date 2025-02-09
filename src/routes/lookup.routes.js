import express from "express";

import {
  retrieveLookupList,
  getLookupTypeById,
} from "../controllers/lookup.controller.js";
import RouteRegistrar from "../middleware/RouteRegistrar.js";
import {
  LookupListSchema,
  LookupTypeSchema,
} from "../schemas/lookup.schema.js";
import { idValidation } from "../schemas/common.schema.js";

const router = express.Router();
const registrar = new RouteRegistrar(router, {
  basePath: "/lookup",
  tags: ["Lookup"],
});

registrar.get("/list", {
  responseSchemas: [{ statusCode: 200, schema: LookupListSchema }],
  controller: retrieveLookupList,
});

registrar.get("/type/:id", {
  requestSchema: {
    paramsSchema: { id: idValidation },
  },
  responseSchemas: [{ statusCode: 200, schema: LookupTypeSchema }],
  controller: getLookupTypeById,
});

export default router;
