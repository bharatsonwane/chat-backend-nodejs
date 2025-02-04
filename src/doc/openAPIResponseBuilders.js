import { StatusCodes } from "http-status-codes";

import { ServiceResponseSchema } from "./serviceResponse.js";

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
