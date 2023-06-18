import React, { useState } from "react"

import { socket } from "@/helpers/socket"
import useSocket from "@/hooks/useSocket"
import Layout from "@/components/layout/layout"

export default function Home() {
  const [roomIdInput, setRoomIdInput] = useState("")

  const { createRoom, joinRoom } = useSocket(socket)

  return (
    <Layout>
      <div className="flex w-[20rem] flex-col items-center justify-center gap-y-2">
        <button
          className="w-full rounded-lg bg-emerald-500 px-3 py-1 text-white hover:bg-emerald-600"
          onClick={() => {
            socket.connect()
            createRoom()
          }}
        >
          Create a Room
        </button>
        <div className="relative flex w-full items-center justify-center">
          <p className="z-10 bg-white px-3">or</p>
          <div className="absolute h-px w-full bg-slate-400"></div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            socket.connect()
            joinRoom(roomIdInput)
            setRoomIdInput("")
          }}
          className="flex w-full flex-col gap-y-2"
        >
          <input
            placeholder="Room ID"
            value={roomIdInput}
            onChange={(e) => setRoomIdInput(e.target.value)}
            type="text"
            className="rounded-lg border px-3 py-1"
          />
          <button className="rounded-lg bg-emerald-500 px-3 py-1 text-white hover:bg-emerald-600">
            Join a Room
          </button>
        </form>
      </div>
    </Layout>
  )
}
