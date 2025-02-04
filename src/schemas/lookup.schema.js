// @ts-nocheck
import { z } from "zod";
import { docRegistry } from "../doc/openAPIDocumentGenerator.js";
import { createApiResponse } from "../doc/openAPIResponseBuilders.js";
import { idSchema } from "./commonValidation.js";

const LookupSchema = z.object({
  id: z.number(),
  label: z.string(),
});

const LookupTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  lookups: z.array(LookupSchema),
});

const LookupListSchema = z.array(LookupTypeSchema);

export const getLookupListDoc = ({ routePath, method, tags }) => {
  docRegistry.registerPath({
    method: method,
    path: routePath,
    tags: tags,
    request: {},
    responses: createApiResponse(LookupListSchema, "Success"),
  });
};

export const getLookupTypeByIdDoc = ({ routePath, method, tags }) => {
  docRegistry.registerPath({
    method: method,
    path: routePath,
    tags: tags,
    request: { params: idSchema.shape.params },
    responses: createApiResponse(LookupTypeSchema, "Success"),
  });
};
