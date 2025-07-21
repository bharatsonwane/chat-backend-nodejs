import express from "express";
import RouteRegistrar from "../middleware/RouteRegistrar.js";
import { authRoleMiddleware } from "../middleware/authRoleMiddleware.js";
import { getMessagesByChatRoom, sendMessage } from "../controllers/chat.controller.js";

const router = express.Router();

const registrar = new RouteRegistrar(router, {
  basePath: "/chat",
  tags: ["Chat"],
});

registrar.get("/chat/:senderId/:receiverId", {
  controller: getMessagesByChatRoom,
});
/**@description send chat */
registrar.post("/send", {
  controller: sendMessage,
});

export default router;
