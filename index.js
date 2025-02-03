/** nodejs inbuilt library */
import path from "path";

import express from "express";

import { envVariable } from "./src/config/envVariable.js";
import routes from "./src/routes/routes.js";
import { HttpError } from "./src/helper/httpError.js";
import openApiRoutes from "./src/doc/openApiRoutes.js";

async function main() {
  /** define add */
  const app = express();

  /** add middleware  */
  app.use(express.json());

  /** Route */
  app.use("/test", (req, res, next) => {
    res.send(
      `<html><body><h1><em>Chat backend project testing.</em></h1></body></html>`
    );
  });

  app.use("/", routes); // App Main Routes

  // Swagger Doc UI
  app.use("/docs", openApiRoutes);

  app.use((req, res, next) => {
    const err = new HttpError("Url not found", 404);
    next(err);
  });

  app.use((err, req, res, next) => {
    res
      .status(err.statusCode ? err.statusCode : 500)
      .send({ error: err.message, data: err.data });
  });

  /** API url */
  app.listen(envVariable.API_PORT, () => {
    console.info(`Server is listening on port '${envVariable.API_PORT}'`);
  });
}

main()
  .then(() => {
    console.log("done");
  })
  .catch((err) => {
    console.error(err);
  });
