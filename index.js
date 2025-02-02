/** nodejs inbuilt library */
import path from "path";

import express from "express";

import { envVariable } from "./src/config/envVariable.js";
import routes from "./src/routes/routes.js";
import { HttpError } from "./src/helper/httpError.js";
import { openAPIRouter } from "./src/doc/openAPIRouter.js";

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

// Swagger UI
app.use("/docs", openAPIRouter);

app.use("/", routes); // App Main Routes

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
app.listen(envVariable.port, () => {
  console.info(`Server is listening on port '${envVariable.port}'`);
});
