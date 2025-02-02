import express from "express";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";


import * as lookupController from "../controllers/lookup.controller.js";

const router = express.Router();

router.get("/", lookupController.retrieveLookupList);

export default router;
