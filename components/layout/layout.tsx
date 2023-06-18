import React from "react"
import Navbar from "../navbar/navbar"

interface Props {
  children: JSX.Element
}

export default function Layout({ children }: Props) {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center text-slate-800">
      <Navbar />
      {children}
    </div>
  )
}
