import React, { useEffect } from "react";
import { socket } from "../socket";

type DataType = {
  username: string;
  room: string;
};

type Props = {
  setData: (data: DataType) => void;
};

type InputProps = {
  placeholder: string;
  name: string;
};

const Room: React.FC<Props> = ({ setData }) => {
  useEffect(() => {
    socket.on("connect", () => {});
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget).entries());

    socket.emit("join_room", data.room as string);
    setData(data as DataType);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg bg-indigo-500 px-3 py-5 w-lg flex flex-col items-center gap-5"
    >
      <h1 className="uppercase font-extrabold text-2xl mb-2">
        Welcome to chat
      </h1>

      <Input placeholder="Username" name="username" />
      <Input placeholder="Room" name="room" />

      <button
        type="submit"
        className="bg-indigo-900 p-2 w-full text-white rounded-lg text-xl cursor-pointer"
      >
        CHAT
      </button>
    </form>
  );
};

export default Room;

const Input: React.FC<InputProps> = ({ name, placeholder }) => {
  return (
    <input
      type="text"
      className="input"
      placeholder={placeholder}
      name={name}
      required
    />
  );
};
