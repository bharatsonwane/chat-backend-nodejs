import { z } from "zod";
import {
  createApiResponse,
  docRegistry,
} from "../doc/openAPIDocumentGenerator.js";
import { ChatMessageSchema } from "./user.schema.js";

export const sendMessageDoc = ({ routePath, method, tags, security }) => {
  docRegistry.registerPath({
    method,
    path: routePath,
    tags,
    security,
    request: {
      body: {
        description: "Send one-to-one message",
        content: {
          "application/json": {
            schema: ChatMessageSchema.openapi({}),
          },
        },
      },
    },
    responses: createApiResponse(
      z.object({
        id: z.string().uuid(),
        senderId: z.string().uuid(),
        receiverId: z.string().uuid(),
        message: z.string(),
        mediaUrl: z.string().optional(),
        timestamp: z.string(),
      }),
      "Message sent"
    ),
  });
};
