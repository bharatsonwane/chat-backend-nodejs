import express from "express";
import {
  UserSchema,
  UserLoginSchema,
  TestQuerySchema,
  getUserDoc,
  getUserByIdDoc,
  testQueryDoc,
  signupUserDoc,
  UserSignupSchema,
} from "../schemas/user.schema.js";
import { commonValidations } from "../schemas/commonValidation.js";
import * as userController from "../controllers/user.controller.js";
import RouteRegistrar from "../middleware/RouteRegistrar.js";
import { userLoginDoc } from "../schemas/user.schema.js";

const router = express.Router();

const registrar = new RouteRegistrar(router, {
  basePath: "/user",
  tags: ["User"],
});

registrar.post("/login", {
  openApiDoc: userLoginDoc,
  schema: { bodySchema: UserLoginSchema },
  controller: userController.postUserLogin,
});

// signup
registrar.post("/signup", {
  openApiDoc: signupUserDoc,
  schema: { bodySchema: UserSignupSchema },
  controller: userController.postUserSignup,
});


// get all users
registrar.get("/list", {
  openApiDoc: getUserDoc,
  controller: userController.getUsers,
});

registrar.get("/:id", {
  openApiDoc: getUserByIdDoc,
  schema: { paramsSchema: { id: commonValidations.id } },
  controller: userController.getUserById,
});


// registrar.get("/test-query", {
//   openApiDoc: testQueryDoc,
//   schema: { querySchema: TestQuerySchema },
//   controller: (req, res) => {
//     res.send("test query");
//   },
// });



export default router;
