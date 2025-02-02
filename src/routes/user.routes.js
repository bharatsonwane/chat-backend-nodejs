// import express from "express";
// // import auth from "../helper/middleware/auth.js";

// const router = express.Router();

// router.post("/authJWT/login", userController.postUserLogin);

// // router.post("/manager/register", userController.postManagerRegister);

// // router.get("/retrieveProfile", auth, userController.getUserProfile);

// export default router;

////////////

import express from "express";
import { z } from "zod";
import { createApiResponse } from "../doc/openAPIResponseBuilders.js";
import {
  UserSchema,
  GetUserSchema,
  UserLoginSchema,
} from "../schemas/user.schema.js";
import { commonValidations } from "../schemas/commonValidation.js";
import { validateRequest } from "../helper/httpHandlers.js";
import * as userController from "../controllers/user.controller.js";
import { userRegistry } from "../schemas/user.schema.js";

const router = express.Router();

userRegistry.registerPath({
  method: "post",
  path: "/user/authJWT/login",
  tags: ["User"],
  request: {
    body: {
      description: "User login",
      content: { "application/json": { schema: UserLoginSchema.openapi({}) } },
    },
  },
  responses: createApiResponse(z.array(UserSchema), "Success"),
});
router.post(
  "/authJWT/login",
  validateRequest({ bodySchema: UserLoginSchema }),
  userController.postUserLogin
);

userRegistry.registerPath({
  method: "get",
  path: "/user",
  tags: ["User"],
  responses: createApiResponse(z.array(UserSchema), "Success"),
});
router.get("/", (req, res) => {
  res.send("Hello World");
});




/** test route with two query parameters */
const TestQuerySchema = z.object({
  query1: z.string().min(1),
  query2: z.string().min(1),
});

userRegistry.registerPath({
  method: "get",
  path: "/user/test-query",
  tags: ["User"],
  request: { query: TestQuerySchema },
  responses: createApiResponse(z.object({ message: z.string() }), "Success"),
});

router.get(
  "/test-query",
  validateRequest({ querySchema: TestQuerySchema }),
  (req, res) => {
    const { query1, query2 } = req.query;
    res.send({ message: `You searched for: ${query1} and ${query2}` });
  }
);


userRegistry.registerPath({
  method: "get",
  path: "/user/{id}",
  tags: ["User"],
  request: { params: GetUserSchema.shape.params },
  responses: createApiResponse(UserSchema, "Success"),
});

router.get(
  "/:id",
  validateRequest({ paramsSchema: {id: commonValidations.id} }),
  (req, res) => {
    res.send("get user by id");
  }
);


export default router;
