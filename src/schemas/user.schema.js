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
export const userLoginDoc = ({ routePath, method, tags }) => {
  docRegistry.registerPath({
    method: method,
    path: routePath,
    tags: tags,
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

export const getUserDoc = ({ routePath, method, tags }) => {
  docRegistry.registerPath({
    method: method,
    path: routePath,
    tags: tags,
    responses: createApiResponse(z.array(UserSchema), "Success"),
  });
};
/** test route with two query parameters */
export const TestQuerySchema = z.object({
  query1: z.string().min(1),
  query2: z.string().min(1),
});

export const testQueryDoc = ({ routePath, method, tags }) => {
  docRegistry.registerPath({
    method: method,
    path: routePath,
    tags: tags,
    request: { query: TestQuerySchema },
    responses: createApiResponse(z.object({ message: z.string() }), "Success"),
  });
};

export const getUserByIdDoc = ({ routePath, method, tags }) => {
  docRegistry.registerPath({
    method: method,
    path: routePath,
    tags: tags,
    request: { params: GetUserSchema.shape.params },
    responses: createApiResponse(UserSchema, "Success"),
  });
};
