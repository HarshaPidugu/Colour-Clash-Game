"use client"

import { useEffect } from "react"
import { useGameStore } from "@/store/gameStore"
import { Clock, Hash, Trophy } from "lucide-react"

export default function RoundTimer() {
  const { timeRemaining, currentRound, roundActive, winningColors, initializeGame } = useGameStore()

  useEffect(() => {
    // Initialize the game when component mounts
    initializeGame()
  }, [initializeGame])

  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60

  // Show round completion status
  if (!roundActive && timeRemaining === 0) {
    const lastWinner = winningColors[0]
    return (
      <div className="flex items-center gap-3 text-[#424242]">
        <div className="flex items-center gap-1">
          <Trophy size={14} className="text-[#ffd93d]" />
          <span className="font-medium text-sm text-green-600">
            {lastWinner ? `${lastWinner.toUpperCase()} WINS!` : "Round Complete"}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 text-[#424242]">
      <div className="flex items-center gap-1">
        <Hash size={14} className="text-[#ffd93d]" />
        <span className="font-medium text-sm">Round {currentRound}</span>
      </div>
      <div className="flex items-center gap-1">
        <Clock size={14} className="text-[#ffd93d]" />
        <span className="font-medium text-sm">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>
    </div>
  )
}
