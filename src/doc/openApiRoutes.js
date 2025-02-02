import express from "express";
import swaggerUi from "swagger-ui-express";
import { generateOpenAPIDocument } from "./openAPIDocumentGenerator.js";

export const openAPIRouter = express.Router();
const openAPIDocument = generateOpenAPIDocument();

openAPIRouter.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(openAPIDocument);
});

openAPIRouter.use("/", swaggerUi.serve, swaggerUi.setup(openAPIDocument));

export default openAPIRouter;
