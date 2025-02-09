//@ts-ignore
import { z } from "zod";
import { docRegistry } from "../doc/openAPIDocumentGenerator.js";

import { createApiResponse } from "../doc/openAPIDocumentGenerator.js";

import { idSchema } from "./common.schema.js";

/**@description user Login schema */
export const UserLoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string(),
});
docRegistry.register("UserLogin", UserLoginSchema);

/**@description user signup schema */
export const UserSignupSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password should be at least 6 characters long"),
  phone: z.string().min(10),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
});
docRegistry.register("UserSignup", UserSignupSchema);

export const UserUpdatePasswordSchema = z.object({
  password: z.string().min(6, "Password should be at least 6 characters long"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10),
});

/**@description User schema */
export const UserSchema = z.object({
  id: z.number().int().optional(),
  title: z.enum(["Mr", "Mrs", "Ms"]),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  middleName: z.string().optional(),
  maidenName: z.string().optional(),
  gender: z.enum(["Male", "Female", "Other"]),
  dob: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, should be YYYY-MM-DD"),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  marriedStatus: z.enum(["Single", "Married"]),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().min(10),
  password: z
    .string()
    .min(6, "Password should be at least 6 characters long")
    .optional(),
  profilePicture: z.string().optional(),
  bio: z.string().optional(),
  userStatusLookupId: z.number().int().optional(),
  userRoleLookupId: z.number().int().optional(),
});
docRegistry.register("User", UserSchema);

/**@description User Update schema */
export const UserUpdateSchema = z.object({
  title: z.enum(["Mr", "Mrs", "Ms"]).optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  middleName: z.string().optional(),
  maidenName: z.string().optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  dob: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, should be YYYY-MM-DD")
    .optional(),
  bloodGroup: z
    .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .optional(),
  marriedStatus: z.enum(["Single", "Married"]).optional(),
  bio: z.string().optional(),
});
docRegistry.register("UserUpdate", UserUpdateSchema);

/**@description Update User Password Doc */
export const updateUserPasswordDoc = ({ routePath, method, tags }) => {
  docRegistry.registerPath({
    method: method,
    path: routePath,
    tags: tags,
    request: {
      params: idSchema.shape.params,
      body: {
        description: "User login",
        content: {
          "application/json": { schema: UserUpdatePasswordSchema.openapi({}) },
        },
      },
    },
    responses: {
      200: {
        description: "Success",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: { type: "string" },
              },
            },
          },
        },
      },
    },
  });
};

/**@description Get User Doc */
export const getUserDoc = ({ routePath, method, tags, security }) => {
  docRegistry.registerPath({
    method: method,
    path: routePath,
    tags: tags,
    security: security,
    responses: createApiResponse(z.array(UserSchema), "Success"),
  });
};

/** test route with two query parameters */
export const TestQuerySchema = z.object({
  query1: z.string().min(1),
  query2: z.string().min(1),
});

/** test query doc */
export const testQueryDoc = ({ routePath, method, tags }) => {
  docRegistry.registerPath({
    method: method,
    path: routePath,
    tags: tags,
    request: { query: TestQuerySchema },
    responses: createApiResponse(z.object({ message: z.string() }), "Success"),
  });
};
