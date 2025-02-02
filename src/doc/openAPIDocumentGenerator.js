import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";

import { userRegistry } from "../schemas/user.schema.js";

export const docRegistry = new OpenAPIRegistry([userRegistry]);

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
      url: "/swagger.json",
    },
  });
}
