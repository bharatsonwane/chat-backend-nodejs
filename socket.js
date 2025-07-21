import { Server } from "socket.io";

const initSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User connected:", userId);

    socket.join(userId); // Join room with their own userId

    socket.on("send-message", (data) => {
      const { receiverId } = data;

      // Emit to receiver room
      io.to(receiverId).emit("receive-message", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", userId);
    });
  });
};

export default initSocket;
