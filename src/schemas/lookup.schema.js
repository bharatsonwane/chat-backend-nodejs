//@ts-ignore
import { z } from "zod";
import { docRegistry } from "../doc/openAPIDocumentGenerator.js";
import { createApiResponse } from "../doc/openAPIDocumentGenerator.js";
import { idSchema } from "./common.schema.js";

const LookupSchema = z.object({
  id: z.number(),
  label: z.string(),
});

export const LookupTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  lookups: z.array(LookupSchema),
});

export const LookupListSchema = z.array(LookupTypeSchema);
