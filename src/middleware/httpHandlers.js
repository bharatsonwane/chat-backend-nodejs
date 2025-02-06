// @ts-nocheck
import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "../doc/serviceResponse.js";

export const handleServiceResponse = (serviceResponse, response) => {
  return response.status(serviceResponse.statusCode).send(serviceResponse);
};

export const validateRequest =
  ({ paramsSchema = {}, querySchema = null, bodySchema = null }) =>
  (req, res, next) => {
    try {
      if (Object.keys(paramsSchema)?.length > 0) {
        Object.entries(paramsSchema).forEach(([key, schema]) => {
          schema.parse(req.params[key]);
        });
      }

      if (querySchema) {
        querySchema.parse(req.query);
      }
      if (bodySchema) {
        bodySchema.parse(req.body);
      }
      // schema.parse({ body: req.body, query: req.query, params: req.params });
      next();
    } catch (err) {
      const errorMessage = `Invalid input: ${err.errors
        .map((e) => e.message)
        .join(", ")}`;
      const statusCode = StatusCodes.BAD_REQUEST;
      const serviceResponse = ServiceResponse.failure(
        errorMessage,
        null,
        statusCode
      );
      return handleServiceResponse(serviceResponse, res);
    }
  };
