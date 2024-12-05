/** nodejs inbuilt library */
import path from "path";

/** nodejs external library */
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

/** swagger */
// import swaggerUi from "swagger-ui-express";
// import swaggerDoc from "./src/documentation/swagger.js";

/** import from other files */
import { envVariable } from "./src/constant/envVariable.js";
import routes from "./src/routes/routes.js";

/** define add */
const app = express();

/** add middleware  */
// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // application/json
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*')
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
//     next()
// })
app.use(cors());

/** set static folder ==> public folder */
// app.use(express.static(path.join(__dirname, "src", "public")));

/** Route */
// app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use("/test", (req, res, next) => {
  res.send(
    `<html><body><h1><em>Chat backend project testing.</em></h1></body></html>`
  );
});
app.use("/", routes); // App Main Routes

app.use((req, res, next) => {
  const err = new Error("Url not found");
  err.status = 404;
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
