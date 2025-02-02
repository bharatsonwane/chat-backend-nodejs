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
import { UserSchema, GetUserSchema, UserLoginSchema } from "../schemas/user.schema.js";
import { validateRequest } from "../helper/httpHandlers.js";
import * as userController from "../controllers/user.controller.js";
import { userRegistry } from "../schemas/user.schema.js";

const router = express.Router();

userRegistry.registerPath({
  method: "post",
  path: "/user/authJWT/login",
  tags: ["User"],
  request: {
    body: { content: { "application/json": { schema: UserLoginSchema.openapi({}) } } },
  },
  responses: createApiResponse(z.array(UserSchema), "Success"),
});
router.post("/authJWT/login", validateRequest(UserLoginSchema), userController.postUserLogin);

userRegistry.registerPath({
  method: "get",
  path: "/user",
  tags: ["User"],
  responses: createApiResponse(z.array(UserSchema), "Success"),
});
router.get("/", (req, res) => {
  res.send("Hello World");
});

userRegistry.registerPath({
  method: "get",
  path: "/user/{id}",
  tags: ["User"],
  request: { params: GetUserSchema.shape.params },
  responses: createApiResponse(UserSchema, "Success"),
});

router.get("/:id", validateRequest(GetUserSchema), (req, res) => {
  res.send("get user by id");
});

export default router;
