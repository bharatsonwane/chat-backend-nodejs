// @ts-nocheck
import { z } from "zod";
import { docRegistry } from "../doc/openAPIDocumentGenerator.js";
import { createApiResponse } from "../doc/openAPIResponseBuilders.js";

export const getLookupListDoc = ({ routePath, method, tags }) => {
  docRegistry.registerPath({
    method: method,
    path: routePath,
    tags: tags,
    request: {},
    responses: createApiResponse(z.object({ message: z.string() }), "Success"),
  });
};
