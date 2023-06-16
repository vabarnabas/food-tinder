import { socket } from "@/helpers/socket";
import React, { useEffect, useState } from "react";

export enum ScreenState {
  BASE = "BASE",
  WAITING_ROOM = "WAITING_ROOM",
  IN_ROOM = "IN_ROOM",
}

export interface Room {
  id: string;
  slug: string;
  createdBy: string;
  likedPlaces: { [key: string]: string[] };
}

export default function Home() {
  const [state, setState] = useState(ScreenState.BASE);
  const [roomIdInput, setRoomIdInput] = useState("");
  const [roomId, setRoomId] = useState("");
  const [room, setRoom] = useState<Room | undefined>(undefined);
  const [userMap, setUserMap] = useState<Record<string, string>>({});

  function mapUser(socketId: string) {
    return userMap[socketId];
  }

  useEffect(() => {
    function onRoomCreated({ slug }: { slug: string }) {
      setRoomId(slug);
      setState(ScreenState.IN_ROOM);
    }

    function onRoomJoined({ slug }: { slug: string }) {
      setRoomId(slug);
      setState(ScreenState.IN_ROOM);
    }

    function onRoomReceived({
      room,
      userMap,
    }: {
      room: Room;
      userMap: Record<string, string>;
    }) {
      setRoom(room);
      setUserMap(userMap);
    }

    socket.on("room_created", onRoomCreated);
    socket.on("room_joined", onRoomJoined);
    socket.on("current_room", onRoomReceived);

    return () => {
      socket.off("room_created", onRoomCreated);
      socket.off("room_joined", onRoomJoined);
      socket.off("current_room", onRoomReceived);
    };
  }, []);

  const createRoom = () => {
    socket.connect();
    socket.emit("create_room");
  };

  const joinRoom = (slug: string) => {
    socket.connect();
    socket.emit("join_room", { slug });
  };

  console.log(room, mapUser(room?.createdBy || ""));

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      {state === ScreenState.BASE ? (
        <div className="flex flex-col items-center justify-center gap-y-2 w-max min-w-[20rem]">
          <button
            className="bg-emerald-500 text-white px-3 py-1 hover:bg-emerald-600 rounded-lg w-full"
            onClick={() => {
              socket.connect();
              createRoom();
            }}
          >
            Create a Room
          </button>
          <div className="w-full relative flex items-center justify-center">
            <p className="bg-white z-10 px-3">or</p>
            <div className="absolute h-px w-full bg-slate-400"></div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              socket.connect();
              joinRoom(roomIdInput);
              setRoomIdInput("");
            }}
            className="flex flex-col gap-y-2 w-full"
          >
            <input
              value={roomIdInput}
              onChange={(e) => setRoomIdInput(e.target.value)}
              type="text"
              className="px-3 py-1 border rounded-lg"
            />
            <button className="bg-emerald-500 text-white px-3 py-1 hover:bg-emerald-600 rounded-lg">
              Join a Room
            </button>
          </form>
        </div>
      ) : null}
      {state === ScreenState.IN_ROOM && userMap ? (
        <div className="min-w-[20rem]">
          <p className="mb-0.5 text-sm font-semibold">Room Code</p>
          <p className="select-all flex items-center justify-center text-2xl font-bold px-3 py-2 rounded-lg bg-slate-50">
            {roomId}
          </p>
          <div className="">
            <p className="mb-0.5 text-sm mt-1 font-semibold">My ID</p>
            <p className="bg-slate-50 px-3 font-semibold py-1 rounded-lg flex items-center justify-center">
              {mapUser(socket.id)}
            </p>
          </div>
          <p className="mb-0.5 text-sm mt-4 font-semibold">Users</p>
          <div className="grid grid-cols-2 gap-2">
            {room &&
              Object.keys(room.likedPlaces).map((user) => (
                <div key={user} className="text-sm text-center">
                  {user}
                </div>
              ))}
          </div>
          {room?.createdBy === mapUser(socket.id) ? (
            <button className="bg-emerald-500 mt-4 text-white px-3 py-1 w-full hover:bg-emerald-600 rounded-lg">
              Start
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
