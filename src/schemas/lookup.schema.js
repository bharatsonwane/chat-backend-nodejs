import { z } from "zod";
import { docRegistry } from "../doc/openAPIDocumentGenerator.js";
import { createApiResponse } from "../doc/openAPIResponseBuilders.js";



export const getLookupListDoc = () => {
  docRegistry.registerPath({
    method: "get",
    path: "/lookup/",
    tags: ["Lookup"],
    request: { },
    responses: createApiResponse(z.object({ message: z.string() }), "Success"),
  });
};
