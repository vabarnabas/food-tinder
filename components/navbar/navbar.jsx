import { useRouter } from "next/router"
import React from "react"

import { socket } from "@/helpers/socket"
import useSocket from "@/hooks/useSocket"

export default function Navbar() {
  const { disconnect } = useSocket(socket)

  const router = useRouter()

  return (
    <div className="fixed inset-x-0 top-0 flex h-12 cursor-pointer items-center border-b px-6">
      <p
        onClick={() => {
          disconnect()
          router.push("/")
        }}
        className="text-xl font-bold text-emerald-500"
      >
        foodner
      </p>
    </div>
  )
}
