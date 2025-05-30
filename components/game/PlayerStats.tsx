"use client"

import { useEffect } from "react"
import { Users } from "lucide-react"
import { useGameStore } from "@/store/gameStore"
import type { ColorType } from "@/types"

export default function PlayerStats() {
  const { winningColors, onlineUsers, initializeUserSession } = useGameStore()

  useEffect(() => {
    initializeUserSession()
  }, [initializeUserSession])

  const getColorClass = (color: ColorType) => {
    switch (color) {
      case "red":
        return "bg-red-600"
      case "green":
        return "bg-green-600"
      case "blue":
        return "bg-blue-600"
    }
  }

  return (
    <div className="bg-gray-50/80 backdrop-blur-sm shadow-sm py-1 px-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Users size={16} className="text-[#424242] mr-1" />
          <span className="text-sm text-[#424242]">
            <span className="font-semibold">{onlineUsers} </span>
          </span>
          {onlineUsers > 0 && (
            <>
              <div className="ml-2 w-2 h-2 bg-green-500 rounded-full" />
              <span className="ml-1 text-xs text-green-600 font-medium"> </span>
            </>
          )}
          {onlineUsers === 0 && (
            <>
              <div className="ml-2 w-2 h-2 bg-gray-400 rounded-full" />
              <span className="ml-1 text-xs text-gray-500 font-medium">OFFLINE</span>
            </>
          )}
        </div>
        <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
          {winningColors.slice(0, 9).map((color, index) => (
            <div
              key={index}
              className={`w-6 h-6 rounded-md ${getColorClass(color)} flex-shrink-0 transition-all duration-300 ${
                index === 0 ? "ring-2 ring-[#ffd93d] ring-offset-1" : ""
              }`}
              title={index === 0 ? `Latest Winner: ${color}` : `Round ${winningColors.length - index} winner`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
