import React, { useState } from "react";
import Room from "./pages/Room";
import Chat from "./pages/Chat";

type Props = {
  username: string;
  room: string;
};

const App = () => {
  const [data, setData] = useState<null | Props>(null);

  return (
    <div className="flex justify-center items-center bg-black h-screen w-screen">
      {data?.room && data.username ? (
        <Chat room={data.room} username={data.username} />
      ) : (
        <Room setData={setData} />
      )}
    </div>
  );
};

export default App;
