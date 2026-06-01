import dotenv from "dotenv";
dotenv.config();

import http from "http";

import { Server } from "socket.io";

import prisma from "./src/prisma/client.js";
import app from "./src/app.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {

  // console.log("User connected:", socket.id);

  socket.on("join_channel", (channelId) => {
      socket.join(channelId);
      console.log(
        `Socket ${socket.id} joined channel ${channelId}`
      );

    });

    socket.on(
  "send_message",
  async ({
    content,
    channelId,
    senderId,
  }) => {

    try {

      const message =
        await prisma.message.create({
          data: {
            content,
            channelId,
            senderId,
          },

          include: {
            sender: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        });

      io.to(channelId).emit(
        "receive_message",
        message
      );

    } catch (error) {

      console.log(error);

    }
});
  // socket.on("disconnect", () => {
  //   console.log("User disconnected:", socket.id);
  // });

});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});