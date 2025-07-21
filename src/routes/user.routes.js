import express, { response } from "express";

// @ts-ignore
import { z } from "zod";
import {
  UserSchema,
  UserLoginSchema,
  getUserDoc,
  UserSignupSchema,
  UserUpdateSchema,
  updateUserPasswordDoc,
} from "../schemas/user.schema.js";
import { idValidation } from "../schemas/common.schema.js";
import {
  createUserProfile,
  getUserById,
  getUsers,
  postUserLogin,
  postUserSignup,
  signoutUser,
  updateUserPassword,
  updateUserProfile,
} from "../controllers/user.controller.js";
import RouteRegistrar from "../middleware/RouteRegistrar.js";
import { authRoleMiddleware } from "../middleware/authRoleMiddleware.js";

const router = express.Router();

const registrar = new RouteRegistrar(router, {
  basePath: "/user",
  tags: ["User"],
});

// /**@description user login  */
registrar.post("/login", {
  requestSchema: { bodySchema: UserLoginSchema },
  responseSchemas: [{ statusCode: 200, schema: UserSchema }],
  controller: postUserLogin,
});

/**@description user signup  */
registrar.post("/signup", {
  requestSchema: { bodySchema: UserSignupSchema },
  responseSchemas: [{ statusCode: 200, schema: UserSignupSchema }],
  controller: postUserSignup,
});

/**@description get all users  */
registrar.get("/list", {
  openApiDoc: getUserDoc,
  middleware: [authRoleMiddleware()],
  controller: getUsers,
});

/**@description Create User */
registrar.post("/create-user", {
  requestSchema: { bodySchema: UserSchema },
  responseSchemas: [{ statusCode: 200, schema: UserSchema }],
  controller: createUserProfile,
});

/**@description update user password  */
registrar.put("/:id/update-password/", {
  openApiDoc: updateUserPasswordDoc,
  requestSchema: {
    paramsSchema: { id: idValidation },
    bodySchema: UserUpdateSchema,
  },
  middleware: [authRoleMiddleware()],
  controller: updateUserPassword,
});

/**@description get user by id  */
registrar.get("/:id", {
  requestSchema: { paramsSchema: { id: idValidation } },
  middleware: [authRoleMiddleware()],
  controller: getUserById,
});

/**@description update user by id  */
registrar.put("/:id", {
  requestSchema: {
    paramsSchema: { id: idValidation },
    bodySchema: UserUpdateSchema,
  },
  responseSchemas: [{ statusCode: 200, schema: UserSchema }],
  middleware: [authRoleMiddleware()],
  controller: updateUserProfile,
});

/**@description user signout */

/**@description signout user */
registrar.post("/signout", {
  controller: signoutUser,
});

// registrar.get("/test-query", {
//   openApiDoc: testQueryDoc,
//   requestSchema: { querySchema: TestQuerySchema },
//   controller: (req, res) => {
//     res.send("test query");
//   },
// });

export default router;
