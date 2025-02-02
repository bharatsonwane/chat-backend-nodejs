import { StatusCodes } from "http-status-codes";
import { z } from "zod";

class ServiceResponse {
  constructor(success, message, responseObject, statusCode) {
    this.success = success;
    this.message = message;
    this.responseObject = responseObject;
    this.statusCode = statusCode;
  }

  static success(message, responseObject, statusCode = StatusCodes.OK) {
    return new ServiceResponse(true, message, responseObject, statusCode);
  }

  static failure(
    message,
    responseObject,
    statusCode = StatusCodes.BAD_REQUEST
  ) {
    return new ServiceResponse(false, message, responseObject, statusCode);
  }
}

const ServiceResponseSchema = (dataSchema) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    responseObject: dataSchema.optional(),
    statusCode: z.number(),
  });

export { ServiceResponse, ServiceResponseSchema };
