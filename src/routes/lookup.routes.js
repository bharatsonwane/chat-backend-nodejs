import express from "express";
import * as lookupController from "../controllers/lookup.controller.js";

const router = express.Router();

router.get("/", lookupController.retrieveLookupList);

export default router;
