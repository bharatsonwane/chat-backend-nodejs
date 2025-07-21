import path from "path";
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import { envVariable } from "./src/config/envVariable.js";
import routes from "./src/routes/routes.js";
import { HttpError } from "./src/helper/httpError.js";
import openApiRoutes from "./src/doc/openApiRoutes.js";
import responseHandler from "./src/middleware/responseHandler.js";
import logger from "./src/helper/logger.js";
import Chat from "./src/services/chat.service.js";

async function main() {
  const app = express();
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinRoom", ({ userId }) => {
      socket.join(userId); // joining room using user ID
    });

    socket.on("sendMessage", async (data) => {
      const { senderId, receiverId, message, mediaUrl } = data;

      const savedMessage = await Chat.saveMessage({ senderId, receiverId, message, mediaUrl });

      io.to(receiverId).emit("receiveMessage", savedMessage);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  app.use(cors({ origin: "http://localhost:5173", credentials: true }));
  app.use(express.json());
  app.use(responseHandler);
  app.use("/test", (req, res) => res.send("Chat backend is running."));
  app.use("/", routes);
  app.use("/docs", openApiRoutes);

  app.use((req, res, next) => next(new HttpError("Url not found", 404)));

  server.listen(envVariable.API_PORT, () => {
    logger.info(`Server is listening on port ${envVariable.API_PORT}`);
  });
}

main().catch((err) => {
  logger.error(err);
});
