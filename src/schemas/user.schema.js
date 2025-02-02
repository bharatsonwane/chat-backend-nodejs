import { z } from "zod";
import { docRegistry } from "../doc/openAPIDocumentGenerator.js";

import { commonValidations } from "./commonValidation.js";
import { createApiResponse } from "../doc/openAPIResponseBuilders.js";

export const UserLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  age: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Input Validation for 'GET users/:id' endpoint
export const GetUserSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

docRegistry.register("User", UserSchema);

/**
 * @swagger
 */
export const userLoginDoc = () => {
  docRegistry.registerPath({
    method: "post",
    path: "/user/authJWT/login",
    tags: ["User"],
    request: {
      body: {
        description: "User login",
        content: {
          "application/json": { schema: UserLoginSchema.openapi({}) },
        },
      },
    },
    responses: createApiResponse(z.array(UserSchema), "Success"),
  });
};

export const getUserDoc = () => {
  docRegistry.registerPath({
    method: "get",
    path: "/user",
    tags: ["User"],
    responses: createApiResponse(z.array(UserSchema), "Success"),
  });
};
/** test route with two query parameters */
export const TestQuerySchema = z.object({
  query1: z.string().min(1),
  query2: z.string().min(1),
});

export const testQueryDoc = () => {
  docRegistry.registerPath({
    method: "get",
    path: "/user/test-query",
    tags: ["User"],
    request: { query: TestQuerySchema },
    responses: createApiResponse(z.object({ message: z.string() }), "Success"),
  });
};

export const getUserByIdDoc = () => {
  docRegistry.registerPath({
    method: "get",
    path: "/user/{id}",
    tags: ["User"],
    request: { params: GetUserSchema.shape.params },
    responses: createApiResponse(UserSchema, "Success"),
  });
};
