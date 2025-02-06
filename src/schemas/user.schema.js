// @ts-nocheck
import { z } from "zod";
import { docRegistry } from "../doc/openAPIDocumentGenerator.js";

import { commonValidations } from "./commonValidation.js";
import { createApiResponse } from "../doc/openAPIResponseBuilders.js";

import { idSchema } from "./commonValidation.js";
import e from "express";

export const UserLoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string(),
});

/**
     id SERIAL PRIMARY KEY,
    title title_enum, -- Use ENUM type
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255),
    maiden_name VARCHAR(255),
    gender VARCHAR(50),
    dob DATE,
    blood_group blood_group_enum, -- Use ENUM type
    married_status BOOLEAN,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),  -- Store hashed password
    profile_picture VARCHAR(255), -- Picture URL
    bio TEXT, -- User biography
    user_status_lookup_id INT, -- Foreign key to lookup table
    user_role_lookup_id INT,   -- Foreign key to lookup table
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_user_status_lookup FOREIGN KEY (user_status_lookup_id) REFERENCES lookup (id) ON DELETE SET NULL,
    CONSTRAINT fk_user_role_lookup FOREIGN KEY (user_role_lookup_id) REFERENCES lookup (id) ON DELETE SET NULL
 */

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
  email: z.string().email("Invalid email"),
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
    request: { params: idSchema.shape.params },
    responses: createApiResponse(UserSchema, "Success"),
  });
};

export const signupUserDoc = ({ routePath, method, tags }) => {
  docRegistry.registerPath({
    method: method,
    path: routePath,
    tags: tags,
    request: {
      body: {
        description: "User signup",
        content: {
          "application/json": { schema: UserSchema.openapi({}) },
        },
      },
    },
    responses: createApiResponse(UserSchema, "Success"),
  });
};
