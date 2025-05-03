import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { socket } from "../socket";

type Props = {
  room: string;
  username: string;
};

type MessageType = {
  message: string;
  username: string;
};

type MessageContent = {
  activeUser: string;
} & MessageType;

const Chat: React.FC<Props> = ({ username, room }) => {
  const [value, setValue] = useState<string>("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const endOfPage = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected!", socket.id);
    });

    const data = (data: any) => {
      console.log("DATA: ", data);
      console.log(`Received: ${data.message} from ${data.username}`);
      setMessages((prev) => [...prev, data]);
    };

    socket.on("receive_message", data);

    socket.on("connect_error", (err) => {
      console.error("❌ Connection error:", err);
    });

    return () => {
      socket.off("connect");
      socket.off("receive_message");
    };
  }, [username, room]);

  useEffect(() => {
    endOfPage.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (value.trim() !== "") {
      const messageContent = { message: value, username, room };
      socket.emit("send_message", messageContent);
      setValue("");
    }
  };

  return (
    <div className="bg-white h-screen w-md relative overflow-hidden">
      <header className="p-5 bg-gray-600">
        <h1 className="font-bold text-2xl text-white">{room}</h1>
      </header>

      <main className="flex flex-col overflow-y-auto h-[88%]">
        {messages.map((item, key) => (
          <Message
            key={key}
            message={item.message}
            username={item.username}
            activeUser={username}
          />
        ))}

        <div ref={endOfPage} />
      </main>

      <form onSubmit={handleSubmit} className="absolute bottom-0 flex w-full">
        <input
          type="text"
          placeholder="Send message"
          className="w-full outline-0 p-2 shadow-2xl bg-white"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValue(e.target.value)
          }
          value={value}
        />

        <button
          type="submit"
          className="bg-indigo-600 p-2 border text-white w-32"
        >
          SEND
        </button>
      </form>
    </div>
  );
};

export default Chat;

const Message: React.FC<MessageContent> = ({
  message,
  username,
  activeUser,
}) => {
  const bgColor = username === activeUser ? "bg-green-600" : "bg-blue-600";
  const self = username === activeUser ? "self-end" : "self-start";

  return (
    <div
      className={`p-3 ${bgColor} w-[300px] m-3 rounded-xl relative min-h-[70px] max-h-[70px] ${self}`}
    >
      <p className="text-white">{message}</p>

      <p className="absolute bottom-1 end-2 text-white">{username}</p>
    </div>
  );
};
