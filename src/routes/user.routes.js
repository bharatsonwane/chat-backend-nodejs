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
  updateUserDoc,
  UserUpdateSchema,
  updateUserPasswordDoc,
} from "../schemas/user.schema.js";
import { commonValidations } from "../schemas/commonValidation.js";
import {getUserById, getUsers, postUserLogin, postUserSignup, updateUserPassword, updateUserProfile} from "../controllers/user.controller.js";
import RouteRegistrar from "../middleware/RouteRegistrar.js";
import { userLoginDoc } from "../schemas/user.schema.js";

const router = express.Router();

const registrar = new RouteRegistrar(router, {
  basePath: "/user",
  tags: ["User"],
});

/**@description user login  */
registrar.post("/login", {
  openApiDoc: userLoginDoc,
  schema: { bodySchema: UserLoginSchema },
  controller: postUserLogin,
});

/**@description user signup  */
registrar.post("/signup", {
  openApiDoc: signupUserDoc,
  schema: { bodySchema: UserSignupSchema },
  controller: postUserSignup,
});


/**@description get all users  */
registrar.get("/list", {
  openApiDoc: getUserDoc,
  controller: getUsers,
});

/**@description update user password  */
registrar.put("/:id/update-password/", {
  openApiDoc: updateUserPasswordDoc,
  schema: {
    paramsSchema: { id: commonValidations.id },
    bodySchema: UserUpdateSchema,
  },
  controller: updateUserPassword,
});


/**@description get user by id  */
registrar.get("/:id", {
  openApiDoc: getUserByIdDoc,
  schema: { paramsSchema: { id: commonValidations.id } },
  controller: getUserById,
});

/**@description update user by id  */
registrar.put("/:id", {
  openApiDoc: updateUserDoc,
  schema: {
    paramsSchema: { id: commonValidations.id },
    bodySchema: UserUpdateSchema,
  },
  controller: updateUserProfile,
});


// registrar.get("/test-query", {
//   openApiDoc: testQueryDoc,
//   schema: { querySchema: TestQuerySchema },
//   controller: (req, res) => {
//     res.send("test query");
//   },
// });

export default router;
