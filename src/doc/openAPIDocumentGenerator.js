// @ts-ignore
import { StatusCodes } from "http-status-codes";
// @ts-ignore
import { z } from "zod";
import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi,
  // @ts-ignore
} from "@asteasolutions/zod-to-openapi";

export function createApiResponse(
  schema,
  description,
  statusCode = StatusCodes.OK
) {
  return {
    [statusCode]: {
      description,
      content: {
        "application/json": {
          schema: schema,
        },
      },
    },
  };
}

export function createApiResponses(configs) {
  const responses = {};
  configs.forEach(({ schema, description, statusCode }) => {
    responses[statusCode] = {
      description,
      content: {
        "application/json": {
          schema: schema,
        },
      },
    };
  });
  return responses;
}

export const docRegistry = new OpenAPIRegistry();

export const bearerAuth = docRegistry.registerComponent(
  "securitySchemes",
  "bearerAuth",
  {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
  }
);

export const commonDocCreator = ({
  routePath,
  method,
  tags,
  requestSchema,
  responseSchemas = [],
  security,
}) => {
  const paramsSchema = requestSchema?.paramsSchema;
  const bodySchema = requestSchema?.bodySchema;
  const querySchema = requestSchema?.querySchema;
  const description = requestSchema?.description || "common document creator";

  const config = {
    method: method,
    path: routePath,
    tags: tags,
    request: {
      params: paramsSchema ? z.object(paramsSchema) : undefined,
      body: bodySchema
        ? {
            description: description,
            content: {
              "application/json": { schema: bodySchema.openapi({}) },
            },
          }
        : undefined,
      query: querySchema ? querySchema : undefined,
    },
    responses: {},
  };

  // api request type which is not a get request
  if (method == "post" || method == "put" || method == "patch") {
    const responses = {};
    responseSchemas.forEach(
      ({ schema, description = "Success", statusCode = StatusCodes.OK }) => {
        if (schema) {
          responses[statusCode] = {
            description,
            content: {
              "application/json": {
                schema: schema,
              },
            },
          };
        }
      }
    );

    config.responses = responses;
  }

  if (security) {
    config.security = security;
  }

  docRegistry.registerPath({ ...config });
};

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
