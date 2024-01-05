import React from "react"

import Navbar from "../navbar/navbar"

interface Props {
  children: JSX.Element
}

export default function Layout({ children }: Props) {
  return (
    <div className="flex h-screen w-screen select-none flex-col items-center justify-center text-slate-800">
      <Navbar />
      <div className="w-full max-w-[1280px] px-3">{children}</div>
    </div>
  )
}
