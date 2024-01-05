import { useRouter } from "next/router"
import React, { useEffect } from "react"
import {
  FaCrown,
  FaDoorClosed,
  FaUserCircle,
  FaUsers,
  FaUserSecret,
} from "react-icons/fa"

import Layout from "@/components/layout/layout"
import { socket } from "@/helpers/socket"
import useSocket from "@/hooks/useSocket"
import useDataStore from "@/stores/data.store"

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
      <div className="w-full">
        <p className="mb-2 flex items-center gap-x-2 text-3xl font-semibold">
          <FaDoorClosed className="text-emerald-500" />
          Room Code
        </p>
        <p className="flex select-all items-center justify-center rounded-lg bg-slate-100 px-3 py-6 text-center text-4xl font-bold">
          {room.slug}
        </p>
        <div className="mt-12 flex w-full justify-between">
          <p className="flex items-center gap-x-2 text-xl font-semibold">
            <FaUsers className="text-emerald-500" />
            Users
          </p>
          <div className="flex items-center gap-x-2">
            <p className="flex flex-shrink-0 items-center gap-x-2 text-lg font-semibold">
              <FaUserSecret className="text-emerald-500" />
              My ID
            </p>
            <p className="flex items-center justify-center gap-x-2 rounded-lg bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-500">
              {room.leader === mapUser(socket.id) ? (
                <FaCrown className="text-amber-500" />
              ) : null}
              {mapUser(socket.id)}
            </p>
          </div>
        </div>
        <div className="mt-3 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {room &&
            Object.keys(room.likedPlaces)
              .sort((a) => {
                if (room.leader === mapUser(a)) {
                  return -1
                } else {
                  return 1
                }
              })
              .map((user) => (
                <div
                  key={user}
                  className="flex items-center justify-between gap-x-1 rounded-md bg-emerald-100 px-3 py-1.5 font-semibold text-emerald-500"
                >
                  {room.leader === user ? (
                    <FaCrown className="" />
                  ) : (
                    <FaUserCircle />
                  )}
                  <p className="">{user}</p>
                </div>
              ))}
        </div>
        {room?.leader === mapUser(socket.id) ? (
          <button
            disabled={Object.keys(room.likedPlaces).length <= 1}
            className="mt-3 w-full rounded-lg bg-emerald-500 px-3 py-1.5 font-semibold text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
          >
            Start
          </button>
        ) : (
          <p className="mt-3 flex w-full justify-center py-1.5">
            Waiting for Leader to Start
          </p>
        )}
      </div>
    </Layout>
  )
}
