import { z } from "zod";

import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi
} from "@asteasolutions/zod-to-openapi";

export const docRegistry = new OpenAPIRegistry();


extendZodWithOpenApi(z);

export function generateOpenAPIDocument() {
  const generator = new OpenApiGeneratorV3(docRegistry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Swagger API",
    },
    externalDocs: {
      description: "View the raw OpenAPI Specification in JSON format",
      url: "/docs/swagger.json",
    },
  });
}
