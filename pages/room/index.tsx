import { useRouter } from "next/router"
import React, { useEffect } from "react"

import { socket } from "@/helpers/socket"
import useSocket from "@/hooks/useSocket"
import useDataStore from "@/stores/data.store"
import Layout from "@/components/layout/layout"

export default function Room() {
  const {
    data: { room, userMap },
  } = useDataStore()
  const router = useRouter()

  useSocket(socket)

  function mapUser(socketId: string) {
    return userMap?.[socketId]
  }

  useEffect(() => {
    if (!Object.keys(room).length) {
      router.push("/")
    }
  }, [room, router])

  if (!Object.keys(room).length) return null

  return (
    <Layout>
      <div className="w-[20rem]">
        <p className="mb-0.5 text-sm font-semibold">Room Code</p>
        <p className="flex select-all items-center justify-center rounded-lg bg-slate-50 px-3 py-2 text-2xl font-bold">
          {room.slug}
        </p>
        <div className="">
          <p className="mb-0.5 mt-1 text-sm font-semibold">My ID</p>
          <p className="flex items-center justify-center rounded-lg bg-slate-50 px-3 py-1 font-semibold">
            {mapUser(socket.id)}
          </p>
        </div>
        <p className="mb-0.5 mt-4 text-sm font-semibold">Users</p>
        <div className="grid grid-cols-2 gap-2">
          {room &&
            Object.keys(room.likedPlaces).map((user) => (
              <div key={user} className="text-center text-sm">
                {user}
              </div>
            ))}
        </div>
        {room?.createdBy === mapUser(socket.id) ? (
          <button className="mt-4 w-full rounded-lg bg-emerald-500 px-3 py-1 text-white hover:bg-emerald-600">
            Start
          </button>
        ) : null}
      </div>
    </Layout>
  )
}
