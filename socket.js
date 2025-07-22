import Chat from "./src/services/chat.service.js";

const onlineUsers = new Map();

export default function socketInit(io) {
  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("register", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    socket.on("send_message", async (messageData) => {
      const { text, media, sent_user_id, chat_room_id, delivered_to, read_by, reaction, receiver_id } = messageData;

      try {
        const chatMessage = new Chat({
          text,
          media,
          sent_user_id,
          chat_room_id,
          delivered_to,
          read_by,
          reaction,
        });

        const savedMessage = await chatMessage.saveMessage();

        // Send to receiver if online
        const receiverSocket = onlineUsers.get(receiver_id);
        if (receiverSocket) {
          io.to(receiverSocket).emit("receive_message", savedMessage);
        }

        // Acknowledge sender
        socket.emit("message_sent", savedMessage);
      } catch (err) {
        socket.emit("error_message", "Message not sent");
      }
    });

    socket.on("disconnect", () => {
      onlineUsers.forEach((socketId, userId) => {
        if (socket.id === socketId) {
          onlineUsers.delete(userId);
        }
      });
      console.log("User disconnected", socket.id);
    });
  });
}
