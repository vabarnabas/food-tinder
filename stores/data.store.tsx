import { create } from "zustand"

import { Room } from "@/types/room.types"

interface DataStore {
  data: {
    room: Room
    userMap: Record<string, string>
  }
  setRoom: (room: Room) => void
  setUserMap: (userMap: Record<string, string>) => void
}

const useDataStore = create<DataStore>()((set) => ({
  data: { room: {} as Room, userMap: {} },
  setRoom: (room: Room) => set((state) => ({ data: { ...state.data, room } })),
  setUserMap: (userMap: Record<string, string>) =>
    set((state) => ({ data: { ...state.data, userMap } })),
}))

export default useDataStore
