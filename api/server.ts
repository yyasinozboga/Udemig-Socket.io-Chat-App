import { Server } from "socket.io";
import express from "express";
import { instrument } from "@socket.io/admin-ui";
import { createServer } from "http";

require("dotenv").config();

const app = express();

const httpServer = createServer(app);

type MessageContent = {
  message: string;
  username: string;
  room: string;
};

interface ServerToClientEvents {
  receive_message: (message: Omit<MessageContent, "room">) => void;
}

interface ClientToServerEvents {
  send_message: (message: MessageContent) => void;

  join_room: (room: string) => void;
}

const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "https://admin.socket.io"],
    credentials: true,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join_room", (room) => {
    console.log(`✅ ${socket.id} joined room: ${room}`);
    socket.join(room);
  });

  socket.on("send_message", ({ message, room, username }) => {
    console.log(`📨 Received from ${username} in room ${room}: ${message}`);
    io.to(room).emit("receive_message", { message, username });
  });
});

instrument(io, { auth: false, mode: "development" });

const port = process.env.PORT || 3000;

httpServer.listen(port, () => {
  console.log("Socket.IO server running on http://localhost:3000");
});
