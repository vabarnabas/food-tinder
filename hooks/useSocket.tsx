import useDataStore from "@/stores/data.store";
import { Room } from "@/types/room.types";
import { SocketOptions } from "dgram";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { ManagerOptions, Socket, io } from "socket.io-client";

export default function useSocket(socket: Socket) {
  const { setRoom, setUserMap } = useDataStore();
  const router = useRouter();

  const createRoom = () => {
    socket.connect();
    socket.emit("create_room");
  };

  const joinRoom = (slug: string) => {
    socket.connect();
    socket.emit("join_room", { slug });
  };

  useEffect(() => {
    function onRoomReceived({
      room,
      userMap,
    }: {
      room: Room;
      userMap: Record<string, string>;
    }) {
      setRoom(room);
      setUserMap(userMap);
      router.push("room");
    }

    socket.on("current_room", onRoomReceived);

    return () => {
      socket.off("current_room", onRoomReceived);
    };
  }, [router, setRoom, setUserMap, socket]);

  return { joinRoom, createRoom };
}
