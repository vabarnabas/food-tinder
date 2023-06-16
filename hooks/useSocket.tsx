import { SocketOptions } from "dgram";
import { useEffect, useRef } from "react";
import { ManagerOptions, Socket, io } from "socket.io-client";

export default function useSocket(
  url: string,
  options?: Partial<ManagerOptions & SocketOptions>
): Socket {
  const { current: socket } = useRef(io(url, options));

  useEffect(() => {
    return () => {
      if (socket) socket.close();
    };
  }, [socket]);

  return socket;
}
