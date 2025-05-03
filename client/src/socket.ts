import { io, Socket } from "socket.io-client";

const URL = "http://localhost:3000";

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

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> =
  io(URL);
